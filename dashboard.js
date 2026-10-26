/**
 * Results Dashboard Controller
 * Handles score visualization, Chart.js integrations, dynamic cards, and report triggers
 */

class DashboardController {
  constructor() {
    this.currentAssessment = null;
    this.radarChartInstance = null;
    this.barChartInstance = null;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Print report button
    const printBtns = document.querySelectorAll('.trigger-print-report');
    printBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.currentAssessment) {
          window.appRouter.showPrintReport(this.currentAssessment);
        } else {
          alert('No active assessment loaded to print.');
        }
      });
    });

    // Retake assessment button
    const retakeBtns = document.querySelectorAll('.trigger-retake-assessment');
    retakeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.appRouter.navigate('assessment');
      });
    });

    // Export assessment JSON button
    const exportBtn = document.getElementById('export-single-assessment-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (!this.currentAssessment) return;
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.currentAssessment, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `RPL_Assessment_${this.currentAssessment.id}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      });
    }
  }

  /**
   * Renders full assessment details into the dashboard DOM
   * @param {Object} assessment 
   */
  renderAssessment(assessment) {
    if (!assessment) return;
    this.currentAssessment = assessment;

    // 1. Candidate Overview & Meta
    const nameEl = document.getElementById('dash-candidate-name');
    const idEl = document.getElementById('dash-assessment-id');
    const dateEl = document.getElementById('dash-assessment-date');
    const domainEl = document.getElementById('dash-domain-title');

    if (nameEl) nameEl.textContent = assessment.candidateName;
    if (idEl) idEl.textContent = assessment.id;
    if (dateEl) dateEl.textContent = new Date(assessment.timestamp).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    if (domainEl) domainEl.textContent = assessment.domainTitle;

    // 2. Score Meter & Level Badge
    const scoreValEl = document.getElementById('dash-overall-score-val');
    const levelBadgeEl = document.getElementById('dash-level-badge');
    const levelStatusEl = document.getElementById('dash-level-status');
    const levelSummaryEl = document.getElementById('dash-level-summary');
    const scoreCircleEl = document.getElementById('dash-score-circle-svg');

    if (scoreValEl) scoreValEl.textContent = assessment.overallScore;
    if (levelBadgeEl) {
      levelBadgeEl.className = `status-pill ${assessment.rplLevel.colorClass || 'badge-blue'}`;
      levelBadgeEl.textContent = assessment.rplLevel.badgeText;
    }
    if (levelStatusEl) levelStatusEl.textContent = assessment.rplLevel.status;
    if (levelSummaryEl) levelSummaryEl.textContent = assessment.rplLevel.summary;

    // Animate circular progress stroke
    if (scoreCircleEl) {
      const radius = 54;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (assessment.overallScore / 100) * circumference;
      scoreCircleEl.style.strokeDasharray = `${circumference} ${circumference}`;
      scoreCircleEl.style.strokeDashoffset = offset;
      scoreCircleEl.style.stroke = assessment.rplLevel.colorHex || '#2563EB';
    }

    // 3. Sub-Scores Metric Cards
    this.updateMetricCard('dash-skills-score', assessment.scores.skills.earned, assessment.scores.skills.max);
    this.updateMetricCard('dash-practical-score', assessment.scores.practical.earned, assessment.scores.practical.max);
    this.updateMetricCard('dash-exp-score', assessment.scores.experience.earned, assessment.scores.experience.max);
    this.updateMetricCard('dash-edu-score', assessment.scores.education.earned, assessment.scores.education.max);

    // 4. Strengths List
    const strengthsContainer = document.getElementById('dash-strengths-container');
    if (strengthsContainer) {
      strengthsContainer.innerHTML = (assessment.strengths || []).map(s => `
        <div class="insight-card insight-strength">
          <div class="insight-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div class="insight-body">
            <h5 class="insight-title font-semibold text-slate-800">${s.title}</h5>
            <p class="text-xs text-slate-600 mt-0.5">${s.desc}</p>
          </div>
        </div>
      `).join('');
    }

    // 5. Skill Gaps List
    const gapsContainer = document.getElementById('dash-gaps-container');
    if (gapsContainer) {
      gapsContainer.innerHTML = (assessment.gaps || []).map(g => `
        <div class="insight-card insight-gap">
          <div class="insight-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div class="insight-body">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <h5 class="insight-title font-semibold text-slate-800">${g.competency}</h5>
              <span class="gap-priority-pill ${g.priority.toLowerCase().includes('high') ? 'priority-high' : 'priority-med'} text-xs font-semibold px-2 py-0.5 rounded">${g.priority}</span>
            </div>
            <p class="text-xs text-slate-500 mb-1">Category: <span class="font-medium text-slate-700">${g.category}</span></p>
            <p class="text-xs text-slate-600">${g.actionRequired}</p>
          </div>
        </div>
      `).join('');
    }

    // 6. Learning & Bridging Recommendations
    const recsContainer = document.getElementById('dash-recommendations-container');
    if (recsContainer) {
      recsContainer.innerHTML = (assessment.recommendations || []).map(r => `
        <div class="rec-card">
          <div class="rec-header">
            <span class="badge badge-purple text-xs font-semibold px-2 py-0.5 rounded">${r.badge}</span>
            <span class="text-xs text-slate-500 font-medium">${r.duration}</span>
          </div>
          <h5 class="rec-title font-semibold text-slate-800 mt-1.5">${r.title}</h5>
          <div class="rec-footer mt-2 d-flex justify-content-between align-items-center">
            <span class="text-xs text-slate-500">Provider: <strong>${r.provider}</strong></span>
            <span class="text-xs text-blue-600 font-medium">Recommended Action &rarr;</span>
          </div>
        </div>
      `).join('');
    }

    // 7. Auditor Simulated Notes
    const notesEl = document.getElementById('dash-assessor-notes');
    if (notesEl) {
      notesEl.textContent = assessment.assessorNotes;
    }

    // 8. Render Charts (Radar & Breakdown)
    this.renderCharts(assessment);
  }

  updateMetricCard(elementId, earned, max) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const pct = Math.round((earned / max) * 100);
    el.innerHTML = `
      <div class="d-flex justify-content-between align-items-baseline mb-1">
        <span class="text-2xl font-bold text-slate-800">${earned} <span class="text-sm font-normal text-slate-400">/ ${max}</span></span>
        <span class="text-xs font-semibold text-blue-600">${pct}%</span>
      </div>
      <div class="metric-bar-bg">
        <div class="metric-bar-fill" style="width: ${pct}%"></div>
      </div>
    `;
  }

  /**
   * Initializes or updates Chart.js charts with offline SVG fallback
   */
  renderCharts(assessment) {
    const radarCanvas = document.getElementById('chart-radar-canvas');
    const barCanvas = document.getElementById('chart-bar-canvas');

    const categories = Object.keys(assessment.radarBreakdown);
    const values = Object.values(assessment.radarBreakdown);

    if (!window.Chart) {
      console.warn('Chart.js not loaded, using offline SVG/CSS visualization fallback.');
      
      if (radarCanvas && radarCanvas.parentElement) {
        radarCanvas.style.display = 'none';
        let fallbackRadar = radarCanvas.parentElement.querySelector('.chart-offline-fallback');
        if (!fallbackRadar) {
          fallbackRadar = document.createElement('div');
          fallbackRadar.className = 'chart-offline-fallback';
          radarCanvas.parentElement.appendChild(fallbackRadar);
        }
        fallbackRadar.innerHTML = `
          <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
            ${categories.map((cat, i) => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">
                  <span>${cat}</span>
                  <span style="color: #2563EB;">${values[i]}%</span>
                </div>
                <div style="height: 8px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
                  <div style="height: 100%; width: ${values[i]}%; background: linear-gradient(90deg, #2563EB, #7C3AED); border-radius: 9999px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      if (barCanvas && barCanvas.parentElement) {
        barCanvas.style.display = 'none';
        let fallbackBar = barCanvas.parentElement.querySelector('.chart-offline-fallback');
        if (!fallbackBar) {
          fallbackBar = document.createElement('div');
          fallbackBar.className = 'chart-offline-fallback';
          barCanvas.parentElement.appendChild(fallbackBar);
        }
        fallbackBar.innerHTML = `
          <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
            ${categories.map((cat, i) => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;">
                  <span>${cat}</span>
                  <span style="color: #7C3AED;">${values[i]}%</span>
                </div>
                <div style="height: 8px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
                  <div style="height: 100%; width: ${values[i]}%; background: #7C3AED; border-radius: 9999px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
      return;
    }

    // 1. Radar Chart
    if (radarCanvas) {
      if (this.radarChartInstance) {
        this.radarChartInstance.destroy();
      }

      const ctxRadar = radarCanvas.getContext('2d');
      this.radarChartInstance = new Chart(ctxRadar, {
        type: 'radar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Candidate Competency Index (%)',
            data: values,
            backgroundColor: 'rgba(37, 99, 235, 0.18)',
            borderColor: '#2563EB',
            borderWidth: 2,
            pointBackgroundColor: '#7C3AED',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#7C3AED',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: {
                stepSize: 20,
                display: false
              },
              grid: {
                color: '#E2E8F0'
              },
              angleLines: {
                color: '#E2E8F0'
              },
              pointLabels: {
                font: {
                  family: 'Inter, sans-serif',
                  size: 11,
                  weight: '600'
                },
                color: '#475569'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Competency: ${ctx.raw}%`
              }
            }
          }
        }
      });
    }

    // 2. Bar Chart
    if (barCanvas) {
      if (this.barChartInstance) {
        this.barChartInstance.destroy();
      }

      const ctxBar = barCanvas.getContext('2d');
      this.barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Demonstrated Score (%)',
            data: values,
            backgroundColor: [
              '#2563EB',
              '#7C3AED',
              '#3B82F6',
              '#8B5CF6',
              '#10B981'
            ],
            borderRadius: 6,
            maxBarThickness: 32
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          scales: {
            x: {
              min: 0,
              max: 100,
              ticks: {
                callback: val => val + '%'
              },
              grid: {
                color: '#F1F5F9'
              }
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  family: 'Inter, sans-serif',
                  size: 11,
                  weight: '500'
                },
                color: '#334155'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Score: ${ctx.raw}%`
              }
            }
          }
        }
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.DashboardController = DashboardController;
}
