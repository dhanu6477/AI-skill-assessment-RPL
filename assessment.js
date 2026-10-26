/**
 * Assessment Form Wizard & Dynamic Competency Handler
 */

const DEMO_PROFILES = {
  alex: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan.dev@example.com',
    phone: '+1 (555) 234-5678',
    educationLevel: 'self-taught',
    certifications: 'Meta Frontend Certificate (Coursera), FreeCodeCamp JavaScript Certification',
    domain: 'software-dev',
    experienceYears: '3.5',
    employmentType: 'freelance',
    roleTitle: 'Freelance Web Developer & Contractor',
    skills: [
      { id: 'html-css', level: 'expert' },
      { id: 'javascript', level: 'expert' },
      { id: 'frontend-framework', level: 'advanced' },
      { id: 'backend-dev', level: 'advanced' },
      { id: 'database-sql', level: 'intermediate' },
      { id: 'git-vcs', level: 'advanced' },
      { id: 'rest-apis', level: 'advanced' },
      { id: 'testing-debugging', level: 'intermediate' },
      { id: 'ci-cd', level: 'novice' },
      { id: 'agile-scrum', level: 'intermediate' }
    ],
    toolsUsed: 'VS Code, React, Node.js, Express, PostgreSQL, TailwindCSS, Git, GitHub, Vercel, Postman',
    portfolioUrl: 'https://github.com/alexmorgan-demo-dev',
    practicalExperience: 'Designed and developed 8 client web applications over the past 3.5 years as an independent contractor. Built a full-stack e-commerce marketplace using React, Node.js, Express, and PostgreSQL handling user authentication, Stripe payment processing, and dynamic inventory queries. Built custom RESTful APIs with role-based access control. Implemented responsive mobile-first UI with modern CSS and Tailwind. Deployed automated hosting via Vercel and Railway with PostgreSQL database migrations.',
    attestation: true
  },

  priya: {
    fullName: 'Priya Sharma',
    email: 'priya.sharma.analytics@example.com',
    phone: '+1 (555) 876-5432',
    educationLevel: 'bachelor',
    certifications: 'Google Data Analytics Professional Certificate, Microsoft Power BI Certified Associate',
    domain: 'data-ai',
    experienceYears: '2.5',
    employmentType: 'full-time',
    roleTitle: 'Junior Data Analyst & Business Reporting Associate',
    skills: [
      { id: 'python-data', level: 'intermediate' },
      { id: 'sql-querying', level: 'advanced' },
      { id: 'data-vis', level: 'expert' },
      { id: 'stats-analysis', level: 'intermediate' },
      { id: 'data-cleaning', level: 'advanced' },
      { id: 'excel-modeling', level: 'expert' },
      { id: 'ml-basics', level: 'novice' },
      { id: 'data-storytelling', level: 'advanced' },
      { id: 'git-notebooks', level: 'intermediate' },
      { id: 'data-ethics', level: 'intermediate' }
    ],
    toolsUsed: 'Power BI, SQL (PostgreSQL & BigQuery), Python (Pandas, Matplotlib), Excel Pivot & VBA, Jupyter Notebooks, Tableau',
    portfolioUrl: 'https://github.com/priyasharma-data-portfolio',
    practicalExperience: 'Spearheaded corporate KPI analytics and automated executive dashboards for a 200-person logistics firm. Authored complex multi-table SQL queries joining order histories, shipping manifests, and customer satisfaction metrics. Extracted and cleaned noisy sensor and dispatch datasets using Python Pandas. Designed interactive Power BI dashboards that reduced monthly financial report compile times by 40%. Delivered monthly executive presentations highlighting operational anomalies and cost-saving trends.',
    attestation: true
  },

  jordan: {
    fullName: 'Jordan Taylor',
    email: 'jordan.taylor.sec@example.com',
    phone: '+1 (555) 432-9876',
    educationLevel: 'associate',
    certifications: 'CompTIA Network+, Security+ Prep Coursework, Cisco CCNA Training',
    domain: 'cybersecurity',
    experienceYears: '2.0',
    employmentType: 'full-time',
    roleTitle: 'IT Support & Security Junior Analyst',
    skills: [
      { id: 'network-security', level: 'advanced' },
      { id: 'vuln-assessment', level: 'intermediate' },
      { id: 'os-hardening', level: 'advanced' },
      { id: 'siem-logs', level: 'intermediate' },
      { id: 'incident-response', level: 'intermediate' },
      { id: 'cryptography', level: 'novice' },
      { id: 'iam-security', level: 'advanced' },
      { id: 'threat-modeling', level: 'intermediate' },
      { id: 'compliance-standards', level: 'novice' },
      { id: 'security-scripting', level: 'intermediate' }
    ],
    toolsUsed: 'Wireshark, Nmap, Splunk, Windows Server Active Directory, Linux Bash, pfSense Firewalls, Nessus',
    portfolioUrl: 'https://github.com/jordantaylor-sec-labs',
    practicalExperience: 'Maintained IT infrastructure security for a college campus environment serving 500+ endpoints. Configured and audited firewall rules, monitored anomalous network traffic utilizing Wireshark packet analysis, and responded to phishing incidents. Managed Active Directory IAM permissions and enforced least-privilege role policies across departments. Automated routine server patch auditing scripts via PowerShell and Bash.',
    attestation: true
  }
};

class AssessmentController {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.selectedDomain = 'software-dev';
    this.customSkills = [];

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderCompetenciesForDomain(this.selectedDomain);
    this.updateStepIndicators();
  }

  bindEvents() {
    // Step navigation buttons
    const nextBtn = document.getElementById('step-next-btn');
    const prevBtn = document.getElementById('step-prev-btn');
    const submitBtn = document.getElementById('submit-assessment-btn');
    const domainSelect = document.getElementById('domain-select');
    const demoSelect = document.getElementById('load-demo-profile-select');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.handleNextStep());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.handlePrevStep());
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    if (domainSelect) {
      domainSelect.addEventListener('change', (e) => {
        this.selectedDomain = e.target.value;
        this.renderCompetenciesForDomain(this.selectedDomain);
      });
    }

    if (demoSelect) {
      demoSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val && DEMO_PROFILES[val]) {
          this.loadDemoProfile(DEMO_PROFILES[val]);
        }
      });
    }

    // Custom skill add button
    const addSkillBtn = document.getElementById('add-custom-skill-btn');
    if (addSkillBtn) {
      addSkillBtn.addEventListener('click', () => this.addCustomSkill());
    }

    // Step navigation pills / indicators click
    const stepIndicators = document.querySelectorAll('.wizard-step-item');
    stepIndicators.forEach((item, idx) => {
      item.addEventListener('click', () => {
        const targetStep = idx + 1;
        if (targetStep < this.currentStep) {
          this.goToStep(targetStep);
        } else if (this.validateCurrentStep()) {
          this.goToStep(targetStep);
        }
      });
    });
  }

  /**
   * Render domain competency matrix with interactive level selectors
   */
  renderCompetenciesForDomain(domainKey) {
    const container = document.getElementById('competencies-container');
    if (!container) return;

    const domain = window.RPL_DOMAINS[domainKey] || window.RPL_DOMAINS['software-dev'];
    if (!domain) return;

    let html = `
      <div class="competencies-header mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="font-bold text-slate-800">${domain.title} Competency Matrix</h4>
            <p class="text-sm text-slate-600">${domain.description}</p>
          </div>
          <span class="badge badge-purple text-xs font-semibold px-2.5 py-1 rounded-full">${domain.competencies.length} Benchmark Competencies</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">Select your actual demonstrated proficiency for each competency based on your real experience.</p>
      </div>
      <div class="competencies-grid">
    `;

    domain.competencies.forEach((comp, idx) => {
      html += `
        <div class="competency-card" data-comp-id="${comp.id}">
          <div class="comp-info">
            <div class="comp-meta">
              <span class="comp-category-tag">${comp.category}</span>
              <span class="comp-index">#${idx + 1}</span>
            </div>
            <h5 class="comp-name">${comp.name}</h5>
          </div>
          <div class="comp-level-selector">
            <div class="level-options">
              <label class="level-radio-pill">
                <input type="radio" name="comp_${comp.id}" value="novice" checked>
                <span class="pill-label">Novice</span>
              </label>
              <label class="level-radio-pill">
                <input type="radio" name="comp_${comp.id}" value="intermediate">
                <span class="pill-label">Intermediate</span>
              </label>
              <label class="level-radio-pill">
                <input type="radio" name="comp_${comp.id}" value="advanced">
                <span class="pill-label">Advanced</span>
              </label>
              <label class="level-radio-pill">
                <input type="radio" name="comp_${comp.id}" value="expert">
                <span class="pill-label">Expert</span>
              </label>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  /**
   * Add custom skill chip
   */
  addCustomSkill() {
    const input = document.getElementById('custom-skill-input');
    const levelSelect = document.getElementById('custom-skill-level');
    const list = document.getElementById('custom-skills-list');

    if (!input || !input.value.trim()) return;

    const skillName = input.value.trim();
    const skillLevel = levelSelect ? levelSelect.value : 'intermediate';
    const skillId = 'custom-' + Date.now();

    this.customSkills.push({
      id: skillId,
      name: skillName,
      level: skillLevel
    });

    const chip = document.createElement('div');
    chip.className = 'custom-skill-chip';
    chip.dataset.id = skillId;
    chip.innerHTML = `
      <span class="chip-title">${skillName}</span>
      <span class="chip-level badge badge-blue text-xs">${skillLevel}</span>
      <button type="button" class="chip-remove" title="Remove">&times;</button>
    `;

    chip.querySelector('.chip-remove').addEventListener('click', () => {
      chip.remove();
      this.customSkills = this.customSkills.filter(s => s.id !== skillId);
    });

    list.appendChild(chip);
    input.value = '';
  }

  /**
   * Loads a complete pre-configured candidate demo profile for instant evaluation
   */
  loadDemoProfile(profile) {
    // Populate Step 1
    const nameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email-address');
    const phoneInput = document.getElementById('phone-number');
    const eduSelect = document.getElementById('education-level');
    const certInput = document.getElementById('certifications-field');

    if (nameInput) nameInput.value = profile.fullName;
    if (emailInput) emailInput.value = profile.email;
    if (phoneInput) phoneInput.value = profile.phone || '';
    if (eduSelect) eduSelect.value = profile.educationLevel;
    if (certInput) certInput.value = profile.certifications;

    // Populate Step 2
    const domainSelect = document.getElementById('domain-select');
    const expInput = document.getElementById('experience-years');
    const empSelect = document.getElementById('employment-type');
    const roleInput = document.getElementById('role-title');

    if (domainSelect) {
      domainSelect.value = profile.domain;
      this.selectedDomain = profile.domain;
      this.renderCompetenciesForDomain(profile.domain);
    }
    if (expInput) expInput.value = profile.experienceYears;
    if (empSelect) empSelect.value = profile.employmentType;
    if (roleInput) roleInput.value = profile.roleTitle;

    // Populate Step 3 (Skills)
    setTimeout(() => {
      if (profile.skills && profile.skills.length > 0) {
        profile.skills.forEach(skill => {
          const radio = document.querySelector(`input[name="comp_${skill.id}"][value="${skill.level}"]`);
          if (radio) {
            radio.checked = true;
          }
        });
      }
    }, 50);

    // Populate Step 4
    const toolsInput = document.getElementById('tools-used');
    const portfolioInput = document.getElementById('portfolio-url');
    const practicalInput = document.getElementById('practical-experience');
    const attestationCheck = document.getElementById('attestation-checkbox');

    if (toolsInput) toolsInput.value = profile.toolsUsed;
    if (portfolioInput) portfolioInput.value = profile.portfolioUrl;
    if (practicalInput) practicalInput.value = profile.practicalExperience;
    if (attestationCheck) attestationCheck.checked = profile.attestation;

    // Notification toast
    this.showToast(`Loaded demo profile: "${profile.fullName}" (${profile.domain})`, 'success');
  }

  /**
   * Validates inputs for the active step
   */
  validateCurrentStep() {
    let isValid = true;
    this.clearErrors();

    if (this.currentStep === 1) {
      const name = document.getElementById('full-name');
      const email = document.getElementById('email-address');

      if (!name || !name.value.trim()) {
        this.setError(name, 'Please provide your full legal name.');
        isValid = false;
      }
      if (!email || !email.value.trim() || !email.value.includes('@')) {
        this.setError(email, 'Please provide a valid contact email address.');
        isValid = false;
      }
    } else if (this.currentStep === 2) {
      const exp = document.getElementById('experience-years');
      const role = document.getElementById('role-title');

      if (!exp || exp.value === '' || parseFloat(exp.value) < 0) {
        this.setError(exp, 'Please enter your total years of hands-on experience (0 or higher).');
        isValid = false;
      }
      if (!role || !role.value.trim()) {
        this.setError(role, 'Please state your primary professional or vocational role.');
        isValid = false;
      }
    } else if (this.currentStep === 3) {
      // Competency step - default values are checked, valid by default
      isValid = true;
    } else if (this.currentStep === 4) {
      const practical = document.getElementById('practical-experience');
      const attestation = document.getElementById('attestation-checkbox');

      if (!practical || practical.value.trim().length < 25) {
        this.setError(practical, 'Please provide at least 25 characters describing projects, tasks, and responsibilities.');
        isValid = false;
      }
      if (!attestation || !attestation.checked) {
        const attestationContainer = document.getElementById('attestation-container');
        this.setError(attestationContainer, 'You must acknowledge the prototype attestation before evaluating.');
        isValid = false;
      }
    }

    return isValid;
  }

  setError(element, message) {
    if (!element) return;
    element.classList.add('input-error');
    const existingMsg = element.parentElement.querySelector('.error-hint');
    if (!existingMsg) {
      const hint = document.createElement('span');
      hint.className = 'error-hint text-xs text-rose-600 mt-1 block';
      hint.textContent = message;
      element.parentElement.appendChild(hint);
    }
  }

  clearErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-hint').forEach(el => el.remove());
  }

  handleNextStep() {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.goToStep(this.currentStep + 1);
      }
    }
  }

  handlePrevStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;
    
    // Toggle step panes
    for (let i = 1; i <= this.totalSteps; i++) {
      const pane = document.getElementById(`step-pane-${i}`);
      if (pane) {
        if (i === this.currentStep) {
          pane.classList.remove('hidden');
          pane.classList.add('active-step-pane');
        } else {
          pane.classList.add('hidden');
          pane.classList.remove('active-step-pane');
        }
      }
    }

    // Toggle button visibility
    const prevBtn = document.getElementById('step-prev-btn');
    const nextBtn = document.getElementById('step-next-btn');
    const submitBtn = document.getElementById('submit-assessment-btn');

    if (prevBtn) {
      prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
    }

    if (nextBtn) {
      nextBtn.style.display = this.currentStep === this.totalSteps ? 'none' : 'inline-flex';
    }

    if (submitBtn) {
      submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-flex' : 'none';
    }

    this.updateStepIndicators();
    window.scrollTo({ top: document.getElementById('assessment-wizard').offsetTop - 80, behavior: 'smooth' });
  }

  updateStepIndicators() {
    const items = document.querySelectorAll('.wizard-step-item');
    items.forEach((item, idx) => {
      const stepIdx = idx + 1;
      item.classList.remove('active', 'completed');
      if (stepIdx === this.currentStep) {
        item.classList.add('active');
      } else if (stepIdx < this.currentStep) {
        item.classList.add('completed');
      }
    });

    const progressFill = document.getElementById('wizard-progress-bar-fill');
    if (progressFill) {
      const pct = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
      progressFill.style.width = `${pct}%`;
    }
  }

  /**
   * Collects all form data across steps
   */
  gatherFormData() {
    const domain = document.getElementById('domain-select').value;
    const domainDef = window.RPL_DOMAINS[domain] || window.RPL_DOMAINS['software-dev'];

    // Collect skills
    const skills = [];
    domainDef.competencies.forEach(comp => {
      const selected = document.querySelector(`input[name="comp_${comp.id}"]:checked`);
      skills.push({
        id: comp.id,
        level: selected ? selected.value : 'novice'
      });
    });

    // Add any custom skills
    this.customSkills.forEach(cs => {
      skills.push({
        id: cs.id,
        name: cs.name,
        level: cs.level
      });
    });

    return {
      fullName: document.getElementById('full-name').value.trim(),
      email: document.getElementById('email-address').value.trim(),
      phone: (document.getElementById('phone-number') || {}).value || '',
      educationLevel: document.getElementById('education-level').value,
      certifications: document.getElementById('certifications-field').value.trim(),
      domain: domain,
      experienceYears: document.getElementById('experience-years').value,
      employmentType: document.getElementById('employment-type').value,
      roleTitle: document.getElementById('role-title').value.trim(),
      skills: skills,
      toolsUsed: document.getElementById('tools-used').value.trim(),
      portfolioUrl: document.getElementById('portfolio-url').value.trim(),
      practicalExperience: document.getElementById('practical-experience').value.trim()
    };
  }

  /**
   * Handles submission, displays AI analysis loader, executes AI Engine, saves to storage, and navigates
   */
  handleSubmit() {
    if (!this.validateCurrentStep()) return;

    const formData = this.gatherFormData();

    // Trigger AI Loading overlay
    this.showAILoader(() => {
      const evaluationResult = window.AIEngine.evaluate(formData);
      
      // Save in history
      window.HistoryManager.save(evaluationResult);

      // Render in dashboard
      if (window.dashboardController) {
        window.dashboardController.renderAssessment(evaluationResult);
      }

      // Navigate to results view
      if (window.appRouter) {
        window.appRouter.navigate('dashboard');
      }

      this.showToast('AI Assessment completed successfully!', 'success');
    });
  }

  /**
   * Simulated AI processing animation for realism
   */
  showAILoader(callback) {
    const modal = document.getElementById('ai-evaluating-modal');
    if (!modal) {
      callback();
      return;
    }

    modal.classList.remove('hidden');
    const statusText = document.getElementById('ai-loader-status');
    const steps = [
      'Tokenizing candidate project portfolio & practical keywords...',
      'Cross-referencing against National Qualifications Framework benchmarks...',
      'Computing weighted competency rubric & experience continuity...',
      'Synthesizing diagnostic strengths & tailored bridging plan...'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length && statusText) {
        statusText.textContent = steps[stepIndex];
      }
    }, 380);

    setTimeout(() => {
      clearInterval(interval);
      modal.classList.add('hidden');
      callback();
    }, 1500);
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `app-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}

if (typeof window !== 'undefined') {
  window.AssessmentController = AssessmentController;
}
