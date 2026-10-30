# SkillBridge RPL - AI Chatbot Backend Server

This backend proxy powers the **AI Assistant** chat mode in the SkillBridge RPL web application.

---

## 🔒 Why is a Backend Required for the AI Mode?

Frontend files (HTML, CSS, JavaScript) run directly inside client web browsers. If you put an AI API key (like Gemini or OpenAI) inside frontend JavaScript, anyone inspecting the page can extract your private key.

To prevent credential leakage and comply with security requirements:
- The frontend calls `POST /api/chat` on this backend.
- This backend loads your API key securely from `server/.env`.
- The backend communicates with Google Gemini or OpenAI and returns the answer to the browser.
- The frontend **Quick Help** mode works completely offline without this backend.

---

## ⚙️ Setup & Configuration

### Step 1: Add your API Key to `.env`
Open `server/.env` in any text editor and add your key:

```env
PORT=3000

# Recommended (Free tier available):
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# Or OpenAI:
# OPENAI_API_KEY=sk-YourOpenAiKeyHere
```

> **Where to get a free API key:**
> - Google Gemini (Free tier): [Google AI Studio](https://aistudio.google.com/)
> - OpenAI: [OpenAI Platform](https://platform.openai.com/api-keys)

---

## 🚀 Running the Server (Choose Any of the 3 Options)

### Option 1: Native Windows PowerShell (Zero Install Required!)
If you are on Windows, you don't even need Node.js or Python installed! Run:

```powershell
powershell -ExecutionPolicy Bypass -File server/server.ps1
```

### Option 2: Node.js (Zero external dependencies)
```bash
node server/server.js
```

### Option 3: Python (Python 3.7+)
```bash
python server/server.py
```

---

## 🌐 Deploying with GitHub Pages

When your static website is deployed to **GitHub Pages** (`https://<username>.github.io/your-repo/`):
1. The **Quick Help** FAQ mode works 100% in the browser with no server required.
2. For the **AI Assistant** mode, deploy this `server/` folder to a free cloud hosting service:
   - [Render.com](https://render.com) (Web Service: `node server.js` or `python server.py`)
   - [Railway.app](https://railway.app)
   - [Fly.io](https://fly.io)
3. Set your environment variable `GEMINI_API_KEY` on your cloud host dashboard.
4. In your live website, click **"⚙️ AI Server Settings"** inside the chat widget and paste your cloud backend URL (e.g., `https://your-server.onrender.com`).
