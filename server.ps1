<#
.SYNOPSIS
  SkillBridge RPL - Native Windows PowerShell AI Backend Proxy
  Runs directly out-of-the-box on Windows 10/11 without installing Node or Python!

.DESCRIPTION
  Uses System.Net.HttpListener and Invoke-RestMethod to proxy AI chat requests
  to Google Gemini or OpenAI API securely using API keys stored in server/.env.
#>

$envFile = Join-Path $PSScriptRoot ".env"
$envVars = @{}

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $k = $parts[0].Trim()
            $v = $parts[1].Trim().Trim('"').Trim("'")
            $envVars[$k] = $v
        }
    }
}

$port = if ($envVars["PORT"]) { [int]$envVars["PORT"] } else { 3000 }
$geminiKey = if ($envVars["GEMINI_API_KEY"]) { $envVars["GEMINI_API_KEY"] } else { $envVars["GOOGLE_API_KEY"] }
$openaiKey = $envVars["OPENAI_API_KEY"]
$systemPrompt = if ($envVars["SYSTEM_PROMPT"]) { $envVars["SYSTEM_PROMPT"] } else {
    "You are the SkillBridge RPL AI Academic Advisor, an expert on Recognition of Prior Learning (RPL), vocational education, portfolio evidence, and skill gap bridging. You help students and career switchers convert real-world experience into recognized qualifications. Keep responses encouraging, well-structured, concise, and academically sound."
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://127.0.0.1:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=======================================================" -ForegroundColor Cyan
    Write-Host " SkillBridge RPL - Native Windows PowerShell AI Backend" -ForegroundColor Green
    Write-Host " Listening on: http://localhost:$port" -ForegroundColor White
    Write-Host " Status:       http://localhost:$port/api/status" -ForegroundColor Gray
    Write-Host " Chat API:     http://localhost:$port/api/chat" -ForegroundColor Gray
    $provider = if ($geminiKey) { "Google Gemini" } elseif ($openaiKey) { "OpenAI" } else { "None (configure in server/.env)" }
    Write-Host " AI Provider:  $provider" -ForegroundColor Yellow
    Write-Host " Press Ctrl+C in this window to stop the server." -ForegroundColor Gray
    Write-Host "=======================================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Add CORS Headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
        $response.ContentType = "application/json"

        # Handle Preflight OPTIONS
        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        $path = $request.Url.AbsolutePath.ToLower()

        # GET /api/status
        if ($request.HttpMethod -eq "GET" -and ($path -eq "/api/status" -or $path -eq "/status")) {
            $isConfigured = [bool](($geminiKey -and $geminiKey.Length -gt 5) -or ($openaiKey -and $openaiKey.Length -gt 5))
            $statusObj = @{
                status = "online"
                service = "SkillBridge RPL Native PowerShell Proxy"
                configured = $isConfigured
                activeProvider = if ($geminiKey) { "Google Gemini" } elseif ($openaiKey) { "OpenAI" } else { "None" }
                notice = if ($isConfigured) { "AI backend is configured and ready." } else { "API key missing in server/.env." }
            }
            $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes(($statusObj | ConvertTo-Json))
            $response.StatusCode = 200
            $response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
            $response.Close()
            continue
        }

        # POST /api/chat
        if ($request.HttpMethod -eq "POST" -and ($path -eq "/api/chat" -or $path -eq "/chat")) {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $bodyText = $reader.ReadToEnd()
            $reader.Close()

            $parsedBody = $null
            try {
                $parsedBody = $bodyText | ConvertFrom-Json
            } catch {
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Invalid JSON body"}')
                $response.StatusCode = 400
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                $response.Close()
                continue
            }

            $userMessage = $parsedBody.message
            if (-not $userMessage) {
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"A message field is required"}')
                $response.StatusCode = 400
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                $response.Close()
                continue
            }

            if (-not $geminiKey -and -not $openaiKey) {
                $errObj = @{
                    error = "AI assistant is not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY to server/.env."
                    configured = $false
                }
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes(($errObj | ConvertTo-Json))
                $response.StatusCode = 503
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                $response.Close()
                continue
            }

            try {
                $aiReply = ""
                $usedProvider = ""

                if ($geminiKey) {
                    $usedProvider = "Google Gemini"
                    $geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$geminiKey"
                    $geminiPayload = @{
                        contents = @(
                            @{
                                role = "user"
                                parts = @(
                                    @{ text = "[System Instruction: $systemPrompt]`n`nCandidate Question: $userMessage" }
                                )
                            }
                        )
                        generationConfig = @{
                            temperature = 0.7
                            maxOutputTokens = 800
                        }
                    } | ConvertTo-Json -Depth 5

                    $geminiResp = Invoke-RestMethod -Uri $geminiUrl -Method Post -Body $geminiPayload -ContentType "application/json"
                    $aiReply = $geminiResp.candidates[0].content.parts[0].text
                } else {
                    $usedProvider = "OpenAI"
                    $openaiUrl = "https://api.openai.com/v1/chat/completions"
                    $openaiPayload = @{
                        model = "gpt-4o-mini"
                        messages = @(
                            @{ role = "system"; content = $systemPrompt }
                            @{ role = "user"; content = $userMessage }
                        )
                        temperature = 0.7
                        max_tokens = 800
                    } | ConvertTo-Json -Depth 5

                    $headers = @{ "Authorization" = "Bearer $openaiKey" }
                    $openaiResp = Invoke-RestMethod -Uri $openaiUrl -Method Post -Body $openaiPayload -Headers $headers -ContentType "application/json"
                    $aiReply = $openaiResp.choices[0].message.content
                }

                $successObj = @{
                    reply = $aiReply
                    provider = $usedProvider
                    timestamp = (Get-Date).ToString("o")
                }
                $respBytes = [System.Text.Encoding]::UTF8.GetBytes(($successObj | ConvertTo-Json))
                $response.StatusCode = 200
                $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
                $response.Close()
            } catch {
                $errObj = @{ error = "AI processing failed: $($_.Exception.Message)" }
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes(($errObj | ConvertTo-Json))
                $response.StatusCode = 500
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                $response.Close()
            }
            continue
        }

        # 404 Fallback
        $response.StatusCode = 404
        $nfBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Endpoint not found"}')
        $response.OutputStream.Write($nfBytes, 0, $nfBytes.Length)
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
