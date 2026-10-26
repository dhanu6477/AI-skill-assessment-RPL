/**
 * Main Application Router & Event Controller
 * Coordinates page navigation, history management, and print view
 */

class AppRouter {
  constructor() {
    this.currentView = 'home';
    this.views = ['home', 'assessment', 'dashboard', 'history', 'about'];
    this.activeReportAssessment = null;

    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindHistoryControls();
    this.bindPrintControls();

    // Check URL hash for direct links (e.g. #assessment)
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && this.views.includes(initialHash)) {
      this.navigate(initialHash);
    } else {
      this.navigate('home');
    }

    // Hash change event listener
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && this.views.includes(hash)) {
        this.navigate(hash, false);
      }
    });

    // Mobile nav toggle
    const mobileBtn = document.getElementById('mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu-drawer');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Populate domains in home grid and assessment dropdown
    this.populateHomeDomainCards();
  }

  /**
   * Switch active view
   */
  navigate(viewName, updateHash = true) {
    if (!this.views.includes(viewName)) return;

    this.currentView = viewName;
    if (updateHash) {
      window.location.hash = viewName;
    }

    // Toggle view sections
    this.views.forEach(v => {
      const section = document.getElementById(`view-${v}`);
      if (section) {
        if (v === viewName) {
          section.classList.remove('hidden');
          section.classList.add('active-view');
        } else {
          section.classList.add('hidden');
          section.classList.remove('active-view');
        }
      }
    });

    // Update nav active states
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.target === viewName) {
        link.classList.add('nav-link-active');
      } else {
        link.classList.remove('nav-link-active');
      }
    });

    // Close mobile menu
    const mobileMenu = document.getElementById('mobile-menu-drawer');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }

    // Specific view activations
    if (viewName === 'history') {
      this.renderHistoryView();
    } else if (viewName === 'dashboard') {
      // Ensure dashboard has assessment data and charts are sized accurately
      if (!window.dashboardController.currentAssessment) {
        const history = window.HistoryManager.getAll();
        if (history.length > 0) {
          window.dashboardController.renderAssessment(history[0]);
        }
      } else {
        // Re-trigger chart render after unhiding to ensure accurate canvas dimensions
        setTimeout(() => {
          if (window.dashboardController && window.dashboardController.currentAssessment) {
            window.dashboardController.renderCharts(window.dashboardController.currentAssessment);
          }
        }, 50);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  bindNavigation() {
    // Links with data-target
    document.querySelectorAll('[data-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        const target = el.dataset.target;
        if (target && this.views.includes(target)) {
          e.preventDefault();
          this.navigate(target);
        }
      });
    });

    // Action buttons that trigger assessment
    document.querySelectorAll('.action-start-assessment').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const domain = btn.dataset.domain;
        if (domain && window.assessmentController) {
          const domainSelect = document.getElementById('domain-select');
          if (domainSelect) {
            domainSelect.value = domain;
            window.assessmentController.selectedDomain = domain;
            window.assessmentController.renderCompetenciesForDomain(domain);
          }
        }
        this.navigate('assessment');
      });
    });
  }

  /**
   * Populate domain tracks on the homepage
   */
  populateHomeDomainCards() {
    const grid = document.getElementById('home-domain-cards-grid');
    if (!grid || !window.RPL_DOMAINS) return;

    let html = '';
    Object.values(window.RPL_DOMAINS).forEach(domain => {
      html += `
        <div class="domain-card">
          <div class="domain-card-header">
            <span class="badge badge-purple text-xs font-semibold px-2 py-0.5 rounded">${domain.competencies.length} Core Rubrics</span>
          </div>
          <h4 class="domain-card-title">${domain.title}</h4>
          <p class="domain-card-desc">${domain.description}</p>
          <div class="domain-card-footer mt-4">
            <button type="button" class="action-start-assessment btn btn-sm btn-outline-primary" data-domain="${domain.id}">
              Assess In This Track &rarr;
            </button>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
    this.bindNavigation(); // Rebind newly created buttons
  }

  /**
   * Renders the saved records table in the History view
   */
  renderHistoryView() {
    const tbody = document.getElementById('history-table-body');
    const emptyState = document.getElementById('history-empty-state');
    const tableContainer = document.getElementById('history-table-container');
    const countBadge = document.getElementById('history-count-badge');

    if (!tbody) return;

    const records = window.HistoryManager.getAll();

    if (countBadge) {
      countBadge.textContent = `${records.length} Records`;
    }

    if (records.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (tableContainer) tableContainer.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');

    tbody.innerHTML = records.map(rec => {
      const dateStr = new Date(rec.timestamp).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      return `
        <tr class="history-row" data-id="${rec.id}">
          <td class="font-medium text-slate-900">
            <div class="candidate-meta">
              <strong>${rec.candidateName}</strong>
              <span class="text-xs text-slate-500 block">${rec.candidateEmail || 'No email provided'}</span>
            </div>
          </td>
          <td>
            <span class="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">
              ${rec.domainTitle}
            </span>
          </td>
          <td>
            <div class="score-pill-container">
              <span class="text-base font-bold text-slate-800">${rec.overallScore}</span>
              <span class="text-xs text-slate-400">/100</span>
            </div>
          </td>
          <td>
            <span class="status-pill text-xs font-semibold px-2 py-0.5 rounded ${rec.rplLevel.colorClass || 'badge-blue'}">
              ${rec.rplLevel.badgeText}
            </span>
          </td>
          <td class="text-xs text-slate-500 whitespace-nowrap">
            ${dateStr}
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action btn-view-dash" title="View in Dashboard" data-id="${rec.id}">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                View
              </button>
              <button class="btn-table-action btn-print-rec" title="Print Assessment Report" data-id="${rec.id}">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Print
              </button>
              <button class="btn-table-action btn-del-rec text-rose-600 hover:text-rose-800" title="Delete record" data-id="${rec.id}">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Bind action buttons on rows
    tbody.querySelectorAll('.btn-view-dash').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = window.HistoryManager.getById(id);
        if (item) {
          window.dashboardController.renderAssessment(item);
          this.navigate('dashboard');
        }
      });
    });

    tbody.querySelectorAll('.btn-print-rec').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = window.HistoryManager.getById(id);
        if (item) {
          this.showPrintReport(item);
        }
      });
    });

    tbody.querySelectorAll('.btn-del-rec').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm('Are you sure you want to delete this assessment record?')) {
          window.HistoryManager.deleteById(id);
          this.renderHistoryView();
        }
      });
    });
  }

  bindHistoryControls() {
    // Export All JSON
    const exportBtn = document.getElementById('history-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        window.HistoryManager.exportJSON();
      });
    }

    // Clear All
    const clearBtn = document.getElementById('history-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all assessment history records? This cannot be undone.')) {
          window.HistoryManager.clearAll();
          this.renderHistoryView();
        }
      });
    }

    // Reset Demo Samples
    const resetDemoBtn = document.getElementById('history-reset-demo-btn');
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener('click', () => {
        const samples = window.HistoryManager.getInitialSampleRecords();
        window.HistoryManager.saveAll(samples);
        this.renderHistoryView();
      });
    }

    // Search filter
    const searchInput = document.getElementById('history-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const rows = document.querySelectorAll('.history-row');
        rows.forEach(r => {
          const text = r.textContent.toLowerCase();
          if (text.includes(q)) {
            r.style.display = '';
          } else {
            r.style.display = 'none';
          }
        });
      });
    }
  }

  /**
   * Displays the printable assessment report modal / transcript
   */
  showPrintReport(assessment) {
    this.activeReportAssessment = assessment;
    const modal = document.getElementById('printable-report-modal');
    if (!modal) return;

    // Fill printable fields
    document.getElementById('rpt-candidate-name').textContent = assessment.candidateName;
    document.getElementById('rpt-candidate-email').textContent = assessment.candidateEmail || 'N/A';
    document.getElementById('rpt-assessment-id').textContent = assessment.id;
    document.getElementById('rpt-assessment-date').textContent = new Date(assessment.timestamp).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('rpt-domain-title').textContent = assessment.domainTitle;
    document.getElementById('rpt-overall-score').textContent = `${assessment.overallScore} / 100`;
    document.getElementById('rpt-level-badge').textContent = assessment.rplLevel.badgeText;
    document.getElementById('rpt-level-summary').textContent = assessment.rplLevel.summary;

    // Scores table
    document.getElementById('rpt-score-skills').textContent = `${assessment.scores.skills.earned} / ${assessment.scores.skills.max}`;
    document.getElementById('rpt-score-practical').textContent = `${assessment.scores.practical.earned} / ${assessment.scores.practical.max}`;
    document.getElementById('rpt-score-exp').textContent = `${assessment.scores.experience.earned} / ${assessment.scores.experience.max}`;
    document.getElementById('rpt-score-edu').textContent = `${assessment.scores.education.earned} / ${assessment.scores.education.max}`;

    // Strengths
    const strengthsEl = document.getElementById('rpt-strengths-list');
    if (strengthsEl) {
      strengthsEl.innerHTML = (assessment.strengths || []).map(s => `
        <li><strong>${s.title}:</strong> ${s.desc}</li>
      `).join('');
    }

    // Gaps & Bridging
    const gapsEl = document.getElementById('rpt-gaps-list');
    if (gapsEl) {
      gapsEl.innerHTML = (assessment.gaps || []).map(g => `
        <li><strong>${g.competency} (${g.priority}):</strong> ${g.actionRequired}</li>
      `).join('');
    }

    // Recommendations
    const recsEl = document.getElementById('rpt-recs-list');
    if (recsEl) {
      recsEl.innerHTML = (assessment.recommendations || []).map(r => `
        <li><strong>${r.title}</strong> (${r.provider} - ${r.duration}) - ${r.badge}</li>
      `).join('');
    }

    // Notes
    document.getElementById('rpt-assessor-notes').textContent = assessment.assessorNotes;

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  bindPrintControls() {
    const modal = document.getElementById('printable-report-modal');
    const closeBtn = document.getElementById('close-report-modal-btn');
    const triggerPrintBtn = document.getElementById('execute-print-btn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
      });
    }

    if (triggerPrintBtn) {
      triggerPrintBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Close on backdrop click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          document.body.classList.remove('modal-open');
        }
      });
    }
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.assessmentController = new window.AssessmentController();
  window.dashboardController = new window.DashboardController();
  window.appRouter = new AppRouter();

  // Load first record into dashboard if exists
  const records = window.HistoryManager.getAll();
  if (records.length > 0) {
    window.dashboardController.renderAssessment(records[0]);
  }
});
