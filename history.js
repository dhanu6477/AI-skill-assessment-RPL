/**
 * Assessment History Storage & Management Module
 * Uses browser localStorage with sample dataset preloading
 */

const HISTORY_STORAGE_KEY = 'skillbridge_rpl_assessment_history';

class HistoryManager {
  /**
   * Returns all saved assessments from localStorage
   * @returns {Array} List of assessment records
   */
  static getAll() {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (data === null) {
        // Pre-populate with realistic initial demo records on very first application load
        const initialSamples = this.getInitialSampleRecords();
        this.saveAll(initialSamples);
        return initialSamples;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading assessment history:', err);
      return [];
    }
  }

  /**
   * Save full list of assessments
   */
  static saveAll(records) {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.error('Error saving assessments to storage:', err);
    }
  }

  /**
   * Save a single new assessment result
   * @param {Object} assessment 
   */
  static save(assessment) {
    const list = this.getAll();
    // Prepend new record so it appears at top
    list.unshift(assessment);
    this.saveAll(list);
    return list;
  }

  /**
   * Retrieve single assessment by ID
   */
  static getById(id) {
    const list = this.getAll();
    return list.find(item => item.id === id) || null;
  }

  /**
   * Delete single assessment by ID
   */
  static deleteById(id) {
    let list = this.getAll();
    list = list.filter(item => item.id !== id);
    this.saveAll(list);
    return list;
  }

  /**
   * Clear all records
   */
  static clearAll() {
    this.saveAll([]);
  }

  /**
   * Export all records as a downloadable JSON file
   */
  static exportJSON() {
    const records = this.getAll();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rpl_assessment_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  /**
   * Initial realistic sample records demonstrating diverse candidate RPL profiles
   */
  static getInitialSampleRecords() {
    return [
      {
        id: 'RPL-DEMO-01',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        candidateName: 'Alex Morgan',
        candidateEmail: 'alex.morgan.demo@example.com',
        domainKey: 'software-dev',
        domainTitle: 'Software Engineering & Web Development',
        overallScore: 82,
        rplLevel: {
          levelNumber: 3,
          badgeText: 'Level 3: Practitioner Competence',
          status: 'Standard RPL Qualified',
          colorClass: 'badge-blue',
          colorHex: '#2563EB',
          summary: 'Candidate demonstrates verified foundational and intermediate skills suitable for formal credit recognition.'
        },
        scores: {
          skills: { earned: 29, max: 35 },
          practical: { earned: 26, max: 30 },
          experience: { earned: 16, max: 20 },
          education: { earned: 11, max: 15 }
        },
        radarBreakdown: {
          'Core Competencies': 83,
          'Practical Evidence': 87,
          'Work Experience': 80,
          'Foundational Learning': 73,
          'Tool & Tech Proficiency': 90
        },
        strengths: [
          { title: 'Demonstrated Industry Longevity', desc: 'Over 3.5 years of documented freelance web development.' },
          { title: 'Full Stack Execution', desc: 'Evidenced client apps built with React, Node.js, Express, and PostgreSQL.' }
        ],
        gaps: [
          { competency: 'Software Testing & QA (Jest/Cypress)', category: 'Quality', priority: 'High Priority', actionRequired: 'Need automated test suite evidence.' }
        ],
        recommendations: [
          { type: 'Bridging Module', title: 'Automated Testing with Jest & Cypress', provider: 'freeCodeCamp', duration: '2 Weeks', badge: 'Lab' }
        ],
        assessorNotes: 'Alex shows strong commercial freelance project deliverables. Candidate will easily qualify for 75% module waivers upon portfolio interview.',
        isDemo: true
      },
      {
        id: 'RPL-DEMO-02',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        candidateName: 'Priya Sharma',
        candidateEmail: 'priya.sharma.demo@example.com',
        domainKey: 'data-ai',
        domainTitle: 'Data Analytics & AI Fundamentals',
        overallScore: 71,
        rplLevel: {
          levelNumber: 3,
          badgeText: 'Level 3: Practitioner Competence',
          status: 'Standard RPL Qualified',
          colorClass: 'badge-blue',
          colorHex: '#2563EB',
          summary: 'Candidate shows verified foundational practical skills in BI dashboarding and SQL querying.'
        },
        scores: {
          skills: { earned: 25, max: 35 },
          practical: { earned: 21, max: 30 },
          experience: { earned: 13, max: 20 },
          education: { earned: 12, max: 15 }
        },
        radarBreakdown: {
          'Core Competencies': 71,
          'Practical Evidence': 70,
          'Work Experience': 65,
          'Foundational Learning': 80,
          'Tool & Tech Proficiency': 75
        },
        strengths: [
          { title: 'SQL & BI Visualizations', desc: 'Built comprehensive corporate KPI dashboards in Power BI and Postgres.' },
          { title: 'Bachelor Credential', desc: 'Holds undergraduate degree in Business Administration with analytical coursework.' }
        ],
        gaps: [
          { competency: 'Python for Data Analysis (Pandas, NumPy)', category: 'Programming', priority: 'Medium Priority', actionRequired: 'Submit sample Jupyter notebooks cleaning dirty datasets.' }
        ],
        recommendations: [
          { type: 'Bridging Module', title: 'Applied Data Science with Python', provider: 'Coursera / Univ of Michigan', duration: '4 Weeks', badge: 'Bridging' }
        ],
        assessorNotes: 'Priya has solid business intelligence competence. Advised to supplement with Python scripting before final certification.',
        isDemo: true
      },
      {
        id: 'RPL-DEMO-03',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
        candidateName: 'Marcus Chen',
        candidateEmail: 'marcus.chen.demo@example.com',
        domainKey: 'cloud-devops',
        domainTitle: 'Cloud Architecture & DevOps Operations',
        overallScore: 54,
        rplLevel: {
          levelNumber: 2,
          badgeText: 'Level 2: Developing Competence',
          status: 'Partial RPL / Bridging Needed',
          colorClass: 'badge-amber',
          colorHex: '#D97706',
          summary: 'Candidate shows promising practical experience in Linux and Docker, with gaps in IaC and multi-cloud networking.'
        },
        scores: {
          skills: { earned: 18, max: 35 },
          practical: { earned: 16, max: 30 },
          experience: { earned: 10, max: 20 },
          education: { earned: 10, max: 15 }
        },
        radarBreakdown: {
          'Core Competencies': 51,
          'Practical Evidence': 53,
          'Work Experience': 50,
          'Foundational Learning': 66,
          'Tool & Tech Proficiency': 60
        },
        strengths: [
          { title: 'Linux Administration Foundations', desc: 'Documented 1.2 years configuring Ubuntu production servers and Docker containers.' }
        ],
        gaps: [
          { competency: 'Infrastructure as Code (Terraform)', category: 'Cloud', priority: 'High Priority', actionRequired: 'Needs automated provisioning lab evidence.' },
          { competency: 'Kubernetes Cluster Orchestration', category: 'Containers', priority: 'High Priority', actionRequired: 'No cluster deployment artifacts submitted.' }
        ],
        recommendations: [
          { type: 'Bridging Module', title: 'Terraform on AWS Fundamentals', provider: 'HashiCorp Learn', duration: '3 Weeks', badge: 'Lab' }
        ],
        assessorNotes: 'Marcus qualifies for junior infrastructure credit; bridging required for senior DevOps level.',
        isDemo: true
      }
    ];
  }
}

if (typeof window !== 'undefined') {
  window.HistoryManager = HistoryManager;
}
