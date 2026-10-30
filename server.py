"""
SkillBridge RPL - AI Chatbot Backend Server (Python)

Standalone, zero-dependency Python 3 HTTP server.
Uses built-in http.server and urllib.request.
API keys are loaded from .env and NEVER exposed to frontend clients.
"""

import http.server
import json
import os
import sys
import urllib.request
import urllib.error
from urllib.parse import urlparse

# Load .env file manually
def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if key not in os.environ:
                        os.environ[key] = val

load_env()

PORT = int(os.environ.get('PORT', 3000))
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '') or os.environ.get('GOOGLE_API_KEY', '')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')

DEFAULT_SYSTEM_PROMPT = os.environ.get(
    'SYSTEM_PROMPT',
    "You are the SkillBridge RPL AI Academic Advisor, an expert on Recognition of Prior Learning (RPL), "
    "vocational education, portfolio evidence, and skill gap bridging. You help students and career switchers "
    "convert real-world experience into recognized qualifications. Keep responses encouraging, well-structured, "
    "concise, and academically sound."
)

def call_gemini(message, history):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    contents = []
    if isinstance(history, list):
        for h in history[-4:]:
            contents.append({
                "role": "model" if h.get("role") == "assistant" else "user",
                "parts": [{"text": h.get("content", "")}]
            })

    contents.append({
        "role": "user",
        "parts": [{"text": f"[System Instruction: {DEFAULT_SYSTEM_PROMPT}]\n\nCandidate Question: {message}"}]
    })

    payload = json.dumps({
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 800
        }
    }).encode('utf-8')

    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        return data['candidates'][0]['content']['parts'][0]['text']

def call_openai(message, history):
    url = "https://api.openai.com/v1/chat/completions"
    
    messages = [{"role": "system", "content": DEFAULT_SYSTEM_PROMPT}]
    if isinstance(history, list):
        for h in history[-4:]:
            messages.append({
                "role": "assistant" if h.get("role") == "assistant" else "user",
                "content": h.get("content", "")
            })
    messages.append({"role": "user", "content": message})

    payload = json.dumps({
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 800
    }).encode('utf-8')

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f"Bearer {OPENAI_API_KEY}"
    }

    req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        return data['choices'][0]['message']['content']


class ChatHandler(http.server.BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path in ['/api/status', '/status']:
            is_configured = bool((GEMINI_API_KEY and len(GEMINI_API_KEY) > 5) or (OPENAI_API_KEY and len(OPENAI_API_KEY) > 5))
            provider = "Google Gemini" if GEMINI_API_KEY else ("OpenAI" if OPENAI_API_KEY else "None")
            
            resp = {
                "status": "online",
                "service": "SkillBridge RPL AI Proxy",
                "configured": is_configured,
                "activeProvider": provider,
                "notice": "AI backend is configured and ready." if is_configured else "API key missing in server/.env."
            }
            body = json.dumps(resp).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(b'{"error": "Endpoint not found"}')

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path in ['/api/chat', '/chat']:
            length = int(self.headers.get('Content-Length', 0))
            raw_body = self.rfile.read(length).decode('utf-8')
            try:
                data = json.loads(raw_body or '{}')
                msg = data.get('message', '').strip()
                hist = data.get('history', [])

                if not msg:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_cors_headers()
                    self.end_headers()
                    self.wfile.write(b'{"error": "A message is required"}')
                    return

                if not GEMINI_API_KEY and not OPENAI_API_KEY:
                    self.send_response(503)
                    self.send_header('Content-Type', 'application/json')
                    self.send_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "error": "AI assistant is not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY to server/.env.",
                        "configured": False
                    }).encode('utf-8'))
                    return

                if GEMINI_API_KEY:
                    reply = call_gemini(msg, hist)
                    provider = "Google Gemini"
                else:
                    reply = call_openai(msg, hist)
                    provider = "OpenAI"

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    "reply": reply,
                    "provider": provider
                }).encode('utf-8'))

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"AI processing failed: {str(e)}"}).encode('utf-8'))
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(b'{"error": "Endpoint not found"}')


if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, ChatHandler)
    print("=" * 55)
    print(" SkillBridge RPL - AI Backend Server (Python)")
    print(f" Listening on: http://localhost:{PORT}")
    print(f" Endpoints: http://localhost:{PORT}/api/status & /api/chat")
    print(f" AI Provider: {'Google Gemini' if GEMINI_API_KEY else ('OpenAI' if OPENAI_API_KEY else 'None (configure in server/.env)')}")
    print("=" * 55)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
