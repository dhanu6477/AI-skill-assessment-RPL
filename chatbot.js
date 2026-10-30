/**
 * SkillBridge RPL - Chatbot Controller
 * Dual-Mode Support:
 *   1. "Quick Help" - Instant predefined offline FAQ chatbot
 *   2. "AI Assistant" - Genuine AI chatbot via secure backend proxy
 */

(function () {
  'use strict';

  // Predefined Knowledge Base for "Quick Help" mode
  const FAQ_DATABASE = [
    {
      id: 'what-is-rpl',
      question: 'What is RPL?',
      keywords: ['what is rpl', 'define rpl', 'meaning of rpl', 'prior learning', 'recognition of prior', 'about rpl', 'rpl meaning'],
      answer: `<strong>Recognition of Prior Learning (RPL)</strong> is an internationally recognized pedagogical framework (supported by UNESCO, ILO, and National Qualification Frameworks).<br><br>
It formally evaluates competencies and skills you have acquired outside of traditional classrooms—such as through freelance contracting, on-the-job training, open-source work, or self-directed study. RPL enables you to convert real-world experience into official academic or vocational qualification credits without repeating coursework you already master.`
    },
    {
      id: 'how-assessment-works',
      question: 'How does skill assessment work?',
      keywords: ['how does skill assessment work', 'how does assessment work', 'how it works', 'assessment process', 'assessment steps', 'wizard', 'workflow'],
      answer: `Our assessment is conducted through a structured <strong>4-Step Guided Wizard</strong>:
<ol>
  <li><strong>Candidate Background:</strong> Captures legal identity, highest prior education tier, and existing non-formal courses/certifications.</li>
  <li><strong>Vocational Track & Tenure:</strong> Select one of 6 target industry domains and specify total years of hands-on experience and employment type.</li>
  <li><strong>Competency Matrix:</strong> Self-rate your proficiency (<em>Novice</em>, <em>Intermediate</em>, <em>Advanced</em>, or <em>Expert</em>) across 10 domain benchmark competencies.</li>
  <li><strong>Practical Evidence:</strong> Document real projects delivered, tools used, and public portfolio/GitHub links.</li>
</ol>
Once submitted, our algorithmic engine synthesizes these inputs into an immediate diagnostic.`
    },
    {
      id: 'score-calculation',
      question: 'How is my assessment score calculated?',
      keywords: ['how is my assessment score calculated', 'score calculation', 'how score calculated', 'scoring formula', 'points', 'evaluation rubric', 'rubric', 'how is score calculated'],
      answer: `Your overall readiness index is calculated on a <strong>0–100 scale</strong> across 4 weighted assessment pillars:
<ul>
  <li><strong>Domain Core Competencies (35%):</strong> Evaluates alignment of your self-rated proficiencies against standardized industry competency weights.</li>
  <li><strong>Practical Evidence & Depth (30%):</strong> Scans project narratives for technical depth, domain vocabulary, deliverables, and verifiable portfolio URLs.</li>
  <li><strong>Work Experience & Tenure (20%):</strong> Assesses continuous years in the field and engagement modality (freelance, full-time, contract).</li>
  <li><strong>Foundational Learning (15%):</strong> Grants credit for prior formal degrees, bootcamps, and self-directed certificates.</li>
</ul>`
    },
    {
      id: 'improve-skills',
      question: 'How can I improve my skills?',
      keywords: ['how can i improve my skills', 'improve skills', 'skill gaps', 'learning recommendations', 'bridging courses', 'next steps', 'how to improve'],
      answer: `After completing your evaluation, navigate to your <strong>Results Dashboard</strong>:
<ul>
  <li><strong>Review Identified Skill Gaps:</strong> The system automatically flags high-priority competencies where your score indicates a need for theoretical or practical strengthening.</li>
  <li><strong>Enroll in Tailored Bridging Modules:</strong> Inspect the curated list of recommended bridging courses (from Coursera, edX, freeCodeCamp, etc.) customized to your specific domain.</li>
  <li><strong>Strengthen Practical Evidence:</strong> Build and host public capstone projects on GitHub demonstrating the specific competencies flagged as gaps.</li>
  <li><strong>Retake Diagnostic:</strong> After upskilling, retake the assessment to see your progress reflected in the readiness gauge.</li>
</ul>`
    },
    {
      id: 'project-purpose',
      question: 'What is the purpose of this project?',
      keywords: ['what is the purpose of this project', 'project purpose', 'why was this built', 'college project', 'about this tool', 'objective', 'aim', 'goal'],
      answer: `This website is an educational engineering capstone project titled <strong>"AI-Assisted Skill Assessment Tool for Recognition of Prior Learning (RPL)"</strong>.<br><br>
<strong>Core Objective:</strong> Traditional RPL evaluations suffer from heavy administrative overhead and manual review delays. This prototype demonstrates how an automated, algorithmic preliminary triage tool can provide instant diagnostic feedback, map applicant portfolios to national standards, and outline bridging roadmaps—empowering self-taught learners while streamlining the pre-assessment workflow for academic institutions.<br><br>
<em>Note: This is an educational demonstration prototype and does not issue certified or officially accredited RPL qualifications.</em>`
    },
    {
      id: 'get-report',
      question: 'How can I get my assessment report?',
      keywords: ['how can i get my assessment report', 'get report', 'print report', 'download report', 'transcript', 'save pdf', 'export report', 'how to print'],
      answer: `You can access and export your assessment report in two ways:
<ol>
  <li><strong>Directly from Results Dashboard:</strong> After submitting an assessment, click the blue <strong>"Print Formal RPL Transcript"</strong> button at the bottom of the dashboard.</li>
  <li><strong>From Assessment History:</strong> Click <strong>"Assessment History"</strong> in the top navigation bar, locate your candidate record, and click the <strong>"Print"</strong> icon.</li>
</ol>
The printable modal uses a print-optimized stylesheet tailored for <strong>standard A4 paper or "Save as PDF"</strong> in your browser print window, complete with institutional headers and signature lines.`
    }
  ];

  // Additional natural language keyword mappings for Quick Help
  const EXTRA_KEYWORDS = [
    {
      keywords: ['level', 'levels', 'qualification levels', 'badge', 'tier'],
      answer: `The RPL rubric categorizes scores into <strong>4 Qualification Readiness Levels</strong>:
<ul>
  <li><strong>Level 4 (85–100 pts) - Advanced Mastery:</strong> Eligible for fast-track RPL qualification credit.</li>
  <li><strong>Level 3 (68–84 pts) - Practitioner Competence:</strong> Standard RPL qualified with minor gap verification.</li>
  <li><strong>Level 2 (48–67 pts) - Developing Competence:</strong> Partial RPL granted with targeted bridging coursework.</li>
  <li><strong>Level 1 (0–47 pts) - Foundational Awareness:</strong> Recommended for preparatory training modules.</li>
</ul>`
    },
    {
      keywords: ['domains', 'tracks', 'fields', 'subjects', 'sectors'],
      answer: `SkillBridge RPL supports <strong>6 Vocational Tracks</strong>:
<ol>
  <li>Software Engineering & Web Development</li>
  <li>Data Analytics & AI Fundamentals</li>
  <li>Cloud Architecture & DevOps Operations</li>
  <li>UI/UX Product Design & User Research</li>
  <li>Cybersecurity & IT Infrastructure Defense</li>
  <li>Digital Marketing & Growth Strategy</li>
</ol>`
    },
    {
      keywords: ['demo', 'sample', 'test candidate', 'alex', 'priya', 'jordan'],
      answer: `You can test the tool in 1 click! In Step 1 of the Skill Assessment form, look for the <strong>"Load Sample Profile"</strong> dropdown and choose:
<ul>
  <li><strong>Alex Morgan:</strong> Web Developer (3.5 yrs freelance)</li>
  <li><strong>Priya Sharma:</strong> Data Analyst (2.5 yrs full-time)</li>
  <li><strong>Jordan Taylor:</strong> Cybersecurity Support (2.0 yrs)</li>
</ul>`
    },
    {
      keywords: ['cost', 'price', 'fee', 'charge', 'free'],
      answer: `This website is an <strong>educational academic demonstration tool</strong> and is completely free to use. No fees, credit cards, or accounts are required.`
    }
  ];

  class ChatbotWidget {
    constructor() {
      this.isOpen = false;
      this.activeTab = 'quick'; // 'quick' | 'ai'
      this.isWaitingAI = false;
      
      // Backend API Configuration (stored in localStorage for customization)
      this.backendUrl = localStorage.getItem('skillbridge_ai_backend_url') || 'http://localhost:3000';
      this.aiStatus = null; // null = untested, true = available, false = offline/unconfigured

      // Message histories for both tabs
      this.quickHelpMessages = [];
      this.aiAssistantMessages = [];

      this.init();
    }

    init() {
      this.bindElements();
      this.bindEvents();
      this.initDefaultMessages();
      this.checkAIBackendStatus();
    }

    bindElements() {
      this.container = document.getElementById('chatbot-widget-container');
      this.launcherBtn = document.getElementById('chatbot-launcher-btn');
      this.window = document.getElementById('chatbot-window');
      this.closeBtn = document.getElementById('chatbot-close-btn');
      this.clearBtn = document.getElementById('chatbot-clear-btn');
      
      this.tabQuickBtn = document.getElementById('chatbot-tab-quick');
      this.tabAIBtn = document.getElementById('chatbot-tab-ai');
      
      this.messagesContainer = document.getElementById('chatbot-messages');
      this.inputField = document.getElementById('chatbot-input-field');
      this.sendBtn = document.getElementById('chatbot-send-btn');
      this.statusDot = document.getElementById('chatbot-status-dot');
      this.statusText = document.getElementById('chatbot-status-text');

      // Config panel elements
      this.configLink = document.getElementById('chatbot-open-config-link');
      this.configPanel = document.getElementById('chatbot-config-panel');
      this.configCloseBtn = document.getElementById('chatbot-config-close-btn');
      this.configSaveBtn = document.getElementById('chatbot-config-save-btn');
      this.configUrlInput = document.getElementById('chatbot-config-url-input');
      this.configStatusNotice = document.getElementById('chatbot-config-status-notice');
    }

    bindEvents() {
      if (this.launcherBtn) {
        this.launcherBtn.addEventListener('click', () => this.toggleWindow());
      }

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.closeWindow());
      }

      if (this.clearBtn) {
        this.clearBtn.addEventListener('click', () => this.clearActiveChat());
      }

      if (this.tabQuickBtn) {
        this.tabQuickBtn.addEventListener('click', () => this.switchTab('quick'));
      }

      if (this.tabAIBtn) {
        this.tabAIBtn.addEventListener('click', () => this.switchTab('ai'));
      }

      if (this.sendBtn) {
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
      }

      if (this.inputField) {
        this.inputField.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
          }
        });
      }

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          if (this.configPanel && this.configPanel.classList.contains('is-open')) {
            this.closeConfigPanel();
          } else {
            this.closeWindow();
          }
        }
      });

      // Config Drawer
      if (this.configLink) {
        this.configLink.addEventListener('click', () => this.openConfigPanel());
      }
      if (this.configCloseBtn) {
        this.configCloseBtn.addEventListener('click', () => this.closeConfigPanel());
      }
      if (this.configSaveBtn) {
        this.configSaveBtn.addEventListener('click', () => this.saveConfig());
      }
    }

    toggleWindow() {
      if (this.isOpen) {
        this.closeWindow();
      } else {
        this.openWindow();
      }
    }

    openWindow() {
      this.isOpen = true;
      this.window.classList.add('is-open');
      this.launcherBtn.classList.add('is-active');
      if (this.inputField) {
        setTimeout(() => this.inputField.focus(), 260);
      }
      this.scrollToBottom();
    }

    closeWindow() {
      this.isOpen = false;
      this.window.classList.remove('is-open');
      this.launcherBtn.classList.remove('is-active');
      if (this.configPanel) {
        this.configPanel.classList.remove('is-open');
      }
    }

    openConfigPanel() {
      if (this.configUrlInput) {
        this.configUrlInput.value = this.backendUrl;
      }
      if (this.configPanel) {
        this.configPanel.classList.add('is-open');
      }
    }

    closeConfigPanel() {
      if (this.configPanel) {
        this.configPanel.classList.remove('is-open');
      }
    }

    saveConfig() {
      if (!this.configUrlInput) return;
      let url = this.configUrlInput.value.trim();
      if (!url) url = 'http://localhost:3000';
      if (url.endsWith('/')) url = url.slice(0, -1);
      this.backendUrl = url;
      localStorage.setItem('skillbridge_ai_backend_url', url);
      this.closeConfigPanel();
      this.checkAIBackendStatus();
      if (this.activeTab === 'ai') {
        this.renderMessages();
      }
    }

    switchTab(tabName) {
      if (this.activeTab === tabName) return;
      this.activeTab = tabName;

      if (tabName === 'quick') {
        this.tabQuickBtn.classList.add('is-active');
        this.tabAIBtn.classList.remove('is-active');
        this.inputField.placeholder = 'Ask a question or click an FAQ above...';
        this.statusText.textContent = 'Quick Help (Instant FAQ)';
      } else {
        this.tabAIBtn.classList.add('is-active');
        this.tabQuickBtn.classList.remove('is-active');
        this.inputField.placeholder = 'Ask AI Assistant about RPL, skills, or career...';
        this.statusText.textContent = this.aiStatus ? 'AI Assistant Online' : 'AI Assistant (Backend Needed)';
      }

      this.renderMessages();
      this.inputField.focus();
    }

    initDefaultMessages() {
      // Default initial bot greeting for Quick Help
      this.quickHelpMessages = [
        {
          sender: 'bot',
          time: this.formatTime(),
          text: `Hello! 👋 Welcome to the <strong>SkillBridge RPL Assistant</strong>.<br><br>
I'm here to help you understand Recognition of Prior Learning, how your practical experience is evaluated, and how our scoring rubric works.<br><br>
You can <strong>type any question</strong> or click one of the common questions below to get an instant answer:`,
          showFaqChips: true
        }
      ];

      // Default initial bot greeting for AI Assistant
      this.aiAssistantMessages = [
        {
          sender: 'bot',
          time: this.formatTime(),
          text: `Welcome to the <strong>AI Assistant Mode</strong>! ✨<br><br>
Here you can have an open-ended conversation with genuine generative AI about:
• Converting non-traditional work experience into academic credit
• Identifying industry-recognized tools for your portfolio
• Career transition advice & bridging module recommendations
• Clarifications on qualification frameworks (UNESCO, NSQF, EQF)<br><br>
<em>Type your question below to begin!</em>`
        }
      ];

      this.renderMessages();
    }

    /**
     * Checks if the backend AI proxy server is active and configured
     */
    async checkAIBackendStatus() {
      try {
        const res = await fetch(`${this.backendUrl}/api/status`, { credentials: 'omit' });
        if (res.ok) {
          const data = await res.json();
          this.aiStatus = data.configured === true;
          this.updateStatusBadge(this.aiStatus);
        } else {
          this.aiStatus = false;
          this.updateStatusBadge(false);
        }
      } catch (err) {
        // Backend not reachable
        this.aiStatus = false;
        this.updateStatusBadge(false);
      }
    }

    updateStatusBadge(isOnline) {
      if (!this.statusDot || !this.statusText) return;
      if (this.activeTab === 'ai') {
        if (isOnline) {
          this.statusDot.style.background = '#10B981';
          this.statusText.textContent = 'AI Assistant Online';
        } else {
          this.statusDot.style.background = '#F59E0B';
          this.statusText.textContent = 'AI Backend Offline / Setup Required';
        }
      } else {
        this.statusDot.style.background = '#10B981';
        this.statusText.textContent = 'Quick Help (Instant)';
      }
    }

    clearActiveChat() {
      if (this.activeTab === 'quick') {
        this.initDefaultMessages();
      } else {
        this.aiAssistantMessages = [
          {
            sender: 'bot',
            time: this.formatTime(),
            text: `AI Chat cleared. How can I assist you with your RPL journey today?`
          }
        ];
        this.renderMessages();
      }
    }

    formatTime() {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    renderMessages() {
      if (!this.messagesContainer) return;
      this.messagesContainer.innerHTML = '';

      const messages = this.activeTab === 'quick' ? this.quickHelpMessages : this.aiAssistantMessages;

      messages.forEach(msg => {
        const row = document.createElement('div');
        row.className = `chat-msg-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`;

        let avatarHtml = '';
        if (msg.sender === 'bot') {
          avatarHtml = `
            <div class="chat-msg-avatar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          `;
        }

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.innerHTML = msg.text;

        const meta = document.createElement('div');
        meta.className = 'chat-msg-meta';
        meta.textContent = msg.time;

        const bodyWrap = document.createElement('div');
        bodyWrap.appendChild(bubble);
        bodyWrap.appendChild(meta);

        // If message includes FAQ chips and we are in quick mode
        if (msg.showFaqChips && this.activeTab === 'quick') {
          const faqSection = document.createElement('div');
          faqSection.className = 'chatbot-faq-section';
          faqSection.innerHTML = `
            <span class="chatbot-faq-label">Frequently Asked Questions:</span>
            <div class="chatbot-faq-grid">
              ${FAQ_DATABASE.map(faq => `
                <button type="button" class="chatbot-faq-chip" data-faq-id="${faq.id}">
                  <span>${faq.question}</span>
                  <span class="chatbot-faq-chip-arrow">&rarr;</span>
                </button>
              `).join('')}
            </div>
          `;

          // Bind chip clicks
          faqSection.querySelectorAll('.chatbot-faq-chip').forEach(btn => {
            btn.addEventListener('click', () => {
              const faqId = btn.dataset.faqId;
              const faqItem = FAQ_DATABASE.find(f => f.id === faqId);
              if (faqItem) {
                this.handleUserFaqSelection(faqItem);
              }
            });
          });

          bodyWrap.appendChild(faqSection);
        }

        // If AI tab and backend is offline/unconfigured, display instructional card
        if (this.activeTab === 'ai' && msg.showBackendAlert) {
          const alertCard = document.createElement('div');
          alertCard.className = 'chatbot-alert-card';
          alertCard.innerHTML = `
            <div class="chatbot-alert-title">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span>AI Assistant Backend Setup Required</span>
            </div>
            <p>
              To protect API credentials, genuine AI responses run through a secure backend proxy rather than storing keys in frontend files.
            </p>
            <p style="margin-top: 0.35rem;">
              <strong>How to run the backend:</strong><br>
              1. Open terminal in the <code>server/</code> folder.<br>
              2. Add your Gemini API key in <code>server/.env</code>.<br>
              3. Run <code>node server.js</code>, <code>python server.py</code>, or native Windows <code>powershell -ExecutionPolicy Bypass -File server.ps1</code>.
            </p>
            <div class="chatbot-alert-actions">
              <button type="button" class="chatbot-alert-btn" id="alert-switch-quick-btn">
                Use Quick Help Instead (Offline)
              </button>
              <button type="button" class="chatbot-alert-btn" id="alert-retry-ai-btn">
                Check Backend Connection
              </button>
            </div>
          `;

          const switchBtn = alertCard.querySelector('#alert-switch-quick-btn');
          if (switchBtn) {
            switchBtn.addEventListener('click', () => this.switchTab('quick'));
          }

          const retryBtn = alertCard.querySelector('#alert-retry-ai-btn');
          if (retryBtn) {
            retryBtn.addEventListener('click', async () => {
              retryBtn.textContent = 'Checking...';
              await this.checkAIBackendStatus();
              this.renderMessages();
            });
          }

          bodyWrap.appendChild(alertCard);
        }

        row.innerHTML = avatarHtml;
        row.appendChild(bodyWrap);
        this.messagesContainer.appendChild(row);
      });

      // Typing indicator
      if (this.isWaitingAI && this.activeTab === 'ai') {
        const typingRow = document.createElement('div');
        typingRow.className = 'chat-msg-row bot-row';
        typingRow.innerHTML = `
          <div class="chat-msg-avatar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div class="chat-typing-bubble">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <span class="typing-label">AI is generating response...</span>
          </div>
        `;
        this.messagesContainer.appendChild(typingRow);
      }

      this.scrollToBottom();
      this.updateStatusBadge(this.aiStatus);
    }

    scrollToBottom() {
      if (this.messagesContainer) {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }
    }

    handleSendMessage() {
      const text = this.inputField.value.trim();
      if (!text) return;

      this.inputField.value = '';
      const time = this.formatTime();

      if (this.activeTab === 'quick') {
        this.processQuickHelpMessage(text, time);
      } else {
        this.processAIMessage(text, time);
      }
    }

    handleUserFaqSelection(faqItem) {
      const time = this.formatTime();
      // Add user question
      this.quickHelpMessages.push({
        sender: 'user',
        time: time,
        text: faqItem.question
      });

      // Add instant bot answer
      this.quickHelpMessages.push({
        sender: 'bot',
        time: time,
        text: faqItem.answer,
        showFaqChips: false
      });

      this.renderMessages();
    }

    /**
     * Mode 1: Quick Help (Predefined Normal Chatbot)
     */
    processQuickHelpMessage(userText, time) {
      // 1. Add user message
      this.quickHelpMessages.push({
        sender: 'user',
        time: time,
        text: this.escapeHtml(userText)
      });

      const query = userText.toLowerCase().trim();

      // 2. Check 6 primary FAQs first
      let matchedFaq = null;
      for (const faq of FAQ_DATABASE) {
        for (const kw of faq.keywords) {
          if (query.includes(kw)) {
            matchedFaq = faq;
            break;
          }
        }
        if (matchedFaq) break;
      }

      // 3. Check extra natural language topics if no primary match
      let extraAnswer = null;
      if (!matchedFaq) {
        for (const extra of EXTRA_KEYWORDS) {
          for (const kw of extra.keywords) {
            if (query.includes(kw)) {
              extraAnswer = extra.answer;
              break;
            }
          }
          if (extraAnswer) break;
        }
      }

      let botResponse = '';
      let showFaqChips = false;

      if (matchedFaq) {
        botResponse = matchedFaq.answer;
      } else if (extraAnswer) {
        botResponse = extraAnswer;
      } else {
        // Unrecognized question fallback
        botResponse = `I couldn't find a direct match in the <strong>Quick Help</strong> knowledge base for: <em>"${this.escapeHtml(userText)}"</em>.<br><br>
You can:
<ul>
  <li>Click one of the <strong>Frequently Asked Questions</strong> below</li>
  <li>Or switch to the <strong>"AI Assistant"</strong> tab above to ask any custom question using our live AI model!</li>
</ul>`;
        showFaqChips = true;
      }

      this.quickHelpMessages.push({
        sender: 'bot',
        time: this.formatTime(),
        text: botResponse,
        showFaqChips: showFaqChips
      });

      this.renderMessages();
    }

    /**
     * Mode 2: AI Assistant (Backend AI Chatbot)
     */
    async processAIMessage(userText, time) {
      if (this.isWaitingAI) return;

      // Add user message
      this.aiAssistantMessages.push({
        sender: 'user',
        time: time,
        text: this.escapeHtml(userText)
      });

      this.isWaitingAI = true;
      this.renderMessages();

      try {
        const payload = {
          message: userText,
          history: this.aiAssistantMessages
            .filter(m => m.sender === 'user' || m.sender === 'bot')
            .slice(-6)
            .map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text.replace(/<[^>]+>/g, '') // strip HTML for API payload
            }))
        };

        const response = await fetch(`${this.backendUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'omit'
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${response.status}`);
        }

        const data = await response.json();
        const aiReply = data.reply || data.message || 'No response returned from AI service.';

        this.aiAssistantMessages.push({
          sender: 'bot',
          time: this.formatTime(),
          text: this.formatAiMarkdown(aiReply)
        });

        this.aiStatus = true;
      } catch (err) {
        console.warn('AI Assistant error:', err.message);

        // Friendly error and instructions when backend is unconfigured
        const isOffline = err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('404');
        
        let errorMsg = ``;
        if (isOffline) {
          errorMsg = `<strong>Unable to connect to the AI Assistant backend.</strong><br><br>
The AI Assistant connects to a secure backend endpoint at <code>${this.backendUrl}</code> to keep API keys private. Currently, the backend server appears to be offline.<br><br>
<em>Please see the setup guide below to start the server, or switch to <strong>Quick Help</strong> for instant answers.</em>`;
        } else {
          errorMsg = `<strong>AI Assistant Service Message:</strong><br>${this.escapeHtml(err.message)}<br><br>
Please verify your API key in <code>server/.env</code>.`;
        }

        this.aiAssistantMessages.push({
          sender: 'bot',
          time: this.formatTime(),
          text: errorMsg,
          showBackendAlert: true
        });

        this.aiStatus = false;
      } finally {
        this.isWaitingAI = false;
        this.renderMessages();
      }
    }

    /**
     * Converts basic markdown (bold, lists, code) from AI into clean HTML
     */
    formatAiMarkdown(text) {
      if (!text) return '';
      let html = this.escapeHtml(text);

      // Bold: **text**
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic: *text*
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Inline code: `code`
      html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
      // Bullet lists
      html = html.replace(/^\s*[-•*]\s+(.*)$/gm, '<li>$1</li>');
      html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
      // Numbered lists
      html = html.replace(/^\s*(\d+)\.\s+(.*)$/gm, '<li>$2</li>');
      // Paragraph linebreaks
      html = html.replace(/\n\n/g, '<br><br>');
      html = html.replace(/\n/g, '<br>');

      return html;
    }

    escapeHtml(str) {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.skillbridgeChatbot = new ChatbotWidget();
    });
  } else {
    window.skillbridgeChatbot = new ChatbotWidget();
  }
})();
