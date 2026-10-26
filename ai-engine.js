/**
 * AI-Assisted Skill Assessment Engine for Recognition of Prior Learning (RPL)
 * Academic Prototype Demonstration Tool
 * 
 * Evaluates candidate qualifications, prior work experience, self-reported skills,
 * and practical evidence against standardized competency benchmarks.
 */

const RPL_DOMAINS = {
  'software-dev': {
    id: 'software-dev',
    title: 'Software Engineering & Web Development',
    description: 'Full-stack development, modern frameworks, APIs, databases, and version control.',
    competencies: [
      { id: 'html-css', name: 'HTML5, Modern CSS & Responsive Layouts', category: 'Frontend', weight: 1.0 },
      { id: 'javascript', name: 'JavaScript (ES6+) & Modern Web APIs', category: 'Frontend', weight: 1.2 },
      { id: 'frontend-framework', name: 'Frontend Framework (React, Vue, or Angular)', category: 'Frontend', weight: 1.1 },
      { id: 'backend-dev', name: 'Backend API Development (Node.js, Python, Java, or PHP)', category: 'Backend', weight: 1.2 },
      { id: 'database-sql', name: 'Relational or NoSQL Databases (SQL, MongoDB, PostgreSQL)', category: 'Data', weight: 1.0 },
      { id: 'git-vcs', name: 'Git & Version Control Systems', category: 'DevOps & Tools', weight: 1.0 },
      { id: 'testing-debugging', name: 'Software Testing, Debugging & Quality Assurance', category: 'Quality', weight: 0.9 },
      { id: 'rest-apis', name: 'RESTful API Architecture & Integration', category: 'Architecture', weight: 1.0 },
      { id: 'ci-cd', name: 'Deployment, CI/CD Pipelines & Hosting', category: 'DevOps & Tools', weight: 0.8 },
      { id: 'agile-scrum', name: 'Agile / Scrum Team Collaboration', category: 'Methodology', weight: 0.8 }
    ],
    keywords: [
      'react', 'vue', 'angular', 'javascript', 'typescript', 'node', 'express', 'python', 'django', 'flask',
      'api', 'rest', 'graphql', 'sql', 'postgres', 'mongodb', 'git', 'github', 'docker', 'ci/cd', 'aws',
      'responsive', 'css', 'html', 'unit test', 'jest', 'agile', 'scrum', 'debugging', 'performance', 'frontend', 'backend'
    ],
    recommendedCourses: [
      { title: 'The Complete Web Developer: Zero to Mastery', provider: 'Udemy / Coursera', type: 'Bridging Module', duration: '6 Weeks' },
      { title: 'Full Stack Open (React, Redux, Node.js, GraphQL, TypeScript)', provider: 'University of Helsinki (Free)', type: 'Open Courseware', duration: '8 Weeks' },
      { title: 'Git & GitHub Hands-on Foundations', provider: 'freeCodeCamp', type: 'Practical Lab', duration: '2 Weeks' },
      { title: 'Database Systems & SQL Optimization', provider: 'edX / Stanford Online', type: 'Core Competency', duration: '4 Weeks' }
    ]
  },

  'data-ai': {
    id: 'data-ai',
    title: 'Data Analytics & AI Fundamentals',
    description: 'Statistical analysis, data cleaning, SQL querying, visualization, and basic machine learning.',
    competencies: [
      { id: 'python-data', name: 'Python for Data Analysis (Pandas, NumPy)', category: 'Programming', weight: 1.2 },
      { id: 'sql-querying', name: 'Advanced SQL Querying & Data Extraction', category: 'Data', weight: 1.2 },
      { id: 'data-vis', name: 'Data Visualization & BI Tools (Power BI, Tableau)', category: 'Visualization', weight: 1.1 },
      { id: 'stats-analysis', name: 'Descriptive & Inferential Statistics', category: 'Mathematics', weight: 1.0 },
      { id: 'data-cleaning', name: 'Data Cleaning, ETL & Quality Validation', category: 'Data', weight: 1.0 },
      { id: 'excel-modeling', name: 'Advanced Excel / Google Sheets Financial & Trend Modeling', category: 'Business', weight: 0.9 },
      { id: 'ml-basics', name: 'Supervised & Unsupervised Machine Learning Basics (Scikit-Learn)', category: 'AI/ML', weight: 0.9 },
      { id: 'data-storytelling', name: 'Data Storytelling & Executive Reporting', category: 'Communication', weight: 0.9 },
      { id: 'git-notebooks', name: 'Jupyter Notebooks, Git & Reproducible Research', category: 'Tools', weight: 0.8 },
      { id: 'data-ethics', name: 'Data Privacy, Governance & Ethics (GDPR/HIPAA)', category: 'Governance', weight: 0.8 }
    ],
    keywords: [
      'python', 'pandas', 'numpy', 'sql', 'tableau', 'power bi', 'excel', 'data cleaning', 'etl',
      'visualization', 'statistics', 'regression', 'clustering', 'machine learning', 'scikit-learn',
      'eda', 'dashboard', 'insights', 'kpi', 'metrics', 'jupyter', 'data pipeline', 'bigquery'
    ],
    recommendedCourses: [
      { title: 'Google Data Analytics Professional Certificate', provider: 'Coursera / Google', type: 'Industry Certificate', duration: '8 Weeks' },
      { title: 'Applied Data Science with Python Specialization', provider: 'Univ of Michigan / Coursera', type: 'Bridging Module', duration: '6 Weeks' },
      { title: 'Advanced SQL for Analytics & Data Engineering', provider: 'DataCamp / Mode', type: 'Practical Lab', duration: '3 Weeks' },
      { title: 'Business Intelligence & Storytelling with Power BI', provider: 'Microsoft Learn', type: 'Core Competency', duration: '4 Weeks' }
    ]
  },

  'cloud-devops': {
    id: 'cloud-devops',
    title: 'Cloud Architecture & DevOps Operations',
    description: 'Cloud infrastructure (AWS/Azure/GCP), containerization, CI/CD pipelines, and Linux administration.',
    competencies: [
      { id: 'cloud-platforms', name: 'Cloud Platform Services (AWS, Azure, or GCP)', category: 'Cloud', weight: 1.2 },
      { id: 'linux-admin', name: 'Linux System Administration & Shell Scripting (Bash)', category: 'Operating Systems', weight: 1.1 },
      { id: 'containers', name: 'Docker Containerization & Multi-container Apps', category: 'Containers', weight: 1.1 },
      { id: 'kubernetes', name: 'Kubernetes Cluster Orchestration & Management', category: 'Containers', weight: 0.9 },
      { id: 'cicd-pipelines', name: 'CI/CD Automated Deployment (GitHub Actions, Jenkins)', category: 'DevOps', weight: 1.1 },
      { id: 'iac-terraform', name: 'Infrastructure as Code (Terraform or CloudFormation)', category: 'Cloud', weight: 0.9 },
      { id: 'networking', name: 'Cloud Networking (VPC, DNS, Load Balancers, Subnets)', category: 'Networking', weight: 1.0 },
      { id: 'monitoring', name: 'System Monitoring & Observability (Prometheus, Grafana, CloudWatch)', category: 'Operations', weight: 0.9 },
      { id: 'cloud-security', name: 'Cloud Identity, IAM & Access Management', category: 'Security', weight: 1.0 },
      { id: 'gitops', name: 'GitOps Workflows & Branching Strategies', category: 'Methodology', weight: 0.8 }
    ],
    keywords: [
      'aws', 'azure', 'gcp', 'linux', 'bash', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible',
      'jenkins', 'github actions', 'ci/cd', 'iam', 'vpc', 'cloudwatch', 'grafana', 'prometheus',
      'load balancer', 'nginx', 'devops', 'helm', 'serverless', 'lambda', 's3', 'ec2'
    ],
    recommendedCourses: [
      { title: 'AWS Certified Solutions Architect Associate Prep', provider: 'AWS Skill Builder / A Cloud Guru', type: 'Industry Prep', duration: '8 Weeks' },
      { title: 'Docker and Kubernetes: The Complete Guide', provider: 'Udemy / Linux Foundation', type: 'Bridging Module', duration: '5 Weeks' },
      { title: 'Automating Infrastructure with Terraform', provider: 'HashiCorp Learn', type: 'Practical Lab', duration: '3 Weeks' },
      { title: 'Linux System Administrator Fundamentals (LFS201)', provider: 'The Linux Foundation', type: 'Core Competency', duration: '6 Weeks' }
    ]
  },

  'ui-ux': {
    id: 'ui-ux',
    title: 'UI/UX Product Design & User Research',
    description: 'Human-centered design, user research, wireframing, high-fidelity prototyping, and design systems.',
    competencies: [
      { id: 'user-research', name: 'User Research, Interviews & Persona Development', category: 'Research', weight: 1.1 },
      { id: 'wireframing', name: 'Information Architecture & Wireframing', category: 'Design', weight: 1.0 },
      { id: 'figma-mastery', name: 'Figma / Sketch High-Fidelity UI Prototyping', category: 'Tools', weight: 1.2 },
      { id: 'design-systems', name: 'Design Systems, Component Libraries & Tokens', category: 'Design', weight: 1.1 },
      { id: 'usability-testing', name: 'Usability Testing & Heuristic Evaluation', category: 'Validation', weight: 1.0 },
      { id: 'visual-design', name: 'Visual Design, Typography, Color Theory & Spacing', category: 'Visual', weight: 1.0 },
      { id: 'interaction-design', name: 'Micro-interactions & Responsive Web/Mobile Patterns', category: 'Interaction', weight: 1.0 },
      { id: 'accessibility', name: 'Web Accessibility Standards (WCAG 2.1 AA)', category: 'Compliance', weight: 0.9 },
      { id: 'developer-handoff', name: 'Developer Handoff, Specs & Design Tokens', category: 'Collaboration', weight: 0.9 },
      { id: 'journey-mapping', name: 'Customer Journey Mapping & Service Blueprints', category: 'Strategy', weight: 0.8 }
    ],
    keywords: [
      'figma', 'sketch', 'prototype', 'wireframe', 'user interview', 'persona', 'usability testing',
      'design system', 'wcag', 'accessibility', 'typography', 'user research', 'ui', 'ux', 'heuristic',
      'user journey', 'flowchart', 'micro-interaction', 'responsive design', 'handoff'
    ],
    recommendedCourses: [
      { title: 'Google UX Design Professional Certificate', provider: 'Coursera / Google', type: 'Industry Certificate', duration: '8 Weeks' },
      { title: 'Design System Fundamentals & Component Libraries', provider: 'Interaction Design Foundation (IxDF)', type: 'Bridging Module', duration: '4 Weeks' },
      { title: 'Advanced Prototyping & Variables in Figma', provider: 'Figma Academy', type: 'Practical Lab', duration: '2 Weeks' },
      { title: 'Accessible Interface Design (WCAG Masterclass)', provider: 'A11y Project / W3C', type: 'Compliance', duration: '3 Weeks' }
    ]
  },

  'cybersecurity': {
    id: 'cybersecurity',
    title: 'Cybersecurity & IT Infrastructure Defense',
    description: 'Threat analysis, network security, vulnerability assessment, incident response, and security hygiene.',
    competencies: [
      { id: 'network-security', name: 'TCP/IP Networking, Firewalls & VPN Architectures', category: 'Networking', weight: 1.2 },
      { id: 'vuln-assessment', name: 'Vulnerability Scanning & Penetration Testing Basics', category: 'Security', weight: 1.1 },
      { id: 'os-hardening', name: 'Operating System Hardening (Windows Server & Linux)', category: 'Systems', weight: 1.0 },
      { id: 'siem-logs', name: 'Security Information & Event Management (SIEM / Splunk / Wireshark)', category: 'Operations', weight: 1.1 },
      { id: 'incident-response', name: 'Incident Response & Threat Mitigation Procedures', category: 'Operations', weight: 1.0 },
      { id: 'cryptography', name: 'Cryptography Fundamentals, PKI & SSL/TLS Protocols', category: 'Foundations', weight: 0.9 },
      { id: 'iam-security', name: 'Identity, Access Management & Zero Trust Principles', category: 'Architecture', weight: 1.0 },
      { id: 'threat-modeling', name: 'Threat Modeling & OWASP Top 10 Web Vulnerabilities', category: 'Security', weight: 1.0 },
      { id: 'compliance-standards', name: 'Security Frameworks & Standards (NIST, ISO 27001, CIS)', category: 'Compliance', weight: 0.9 },
      { id: 'security-scripting', name: 'Python / PowerShell Scripting for Security Automation', category: 'Tools', weight: 0.8 }
    ],
    keywords: [
      'wireshark', 'nmap', 'kali', 'siem', 'splunk', 'firewall', 'owasp', 'vpn', 'vulnerability',
      'penetration testing', 'incident response', 'nist', 'iso 27001', 'cryptography', 'zero trust',
      'ids/ips', 'malware', 'phishing', 'tcp/ip', 'dns', 'pki', 'ssl', 'tls', 'powershell', 'linux'
    ],
    recommendedCourses: [
      { title: 'CompTIA Security+ (SY0-701) Certification Training', provider: 'Professor Messer / Cybrary', type: 'Certification Prep', duration: '7 Weeks' },
      { title: 'Hands-on Network Security & Packet Analysis with Wireshark', provider: 'freeCodeCamp / INE', type: 'Practical Lab', duration: '3 Weeks' },
      { title: 'Google Cybersecurity Professional Certificate', provider: 'Coursera / Google', type: 'Industry Certificate', duration: '6 Weeks' },
      { title: 'Web Application Security & OWASP Top 10 Mitigation', provider: 'PortSwigger Web Security Academy (Free)', type: 'Bridging Lab', duration: '4 Weeks' }
    ]
  },

  'digital-marketing': {
    id: 'digital-marketing',
    title: 'Digital Marketing & Growth Strategy',
    description: 'SEO, SEM, social media campaigns, marketing analytics, funnel optimization, and email automation.',
    competencies: [
      { id: 'seo-sem', name: 'Search Engine Optimization (SEO) & Google Ads (SEM)', category: 'Search', weight: 1.2 },
      { id: 'analytics-ga4', name: 'Marketing Analytics, GA4 & Conversion Tracking', category: 'Analytics', weight: 1.2 },
      { id: 'social-media', name: 'Paid Social Ads (Meta Ads Manager, LinkedIn Campaign)', category: 'Paid Media', weight: 1.1 },
      { id: 'content-strategy', name: 'Content Strategy, Copywriting & Brand Storytelling', category: 'Content', weight: 1.0 },
      { id: 'email-crm', name: 'Email Marketing Automation & CRM Tools (HubSpot, Mailchimp)', category: 'Lifecycle', weight: 1.0 },
      { id: 'cro-ab-testing', name: 'Conversion Rate Optimization (CRO) & A/B Testing', category: 'Optimization', weight: 1.0 },
      { id: 'budget-roi', name: 'Campaign Budgeting, CAC, LTV & ROAS Management', category: 'Strategy', weight: 0.9 },
      { id: 'influencer-pr', name: 'Influencer Marketing & Digital PR Outreach', category: 'Outreach', weight: 0.8 },
      { id: 'cms-management', name: 'CMS & Landing Page Builders (WordPress, Webflow)', category: 'Tools', weight: 0.9 },
      { id: 'marketing-compliance', name: 'Data Privacy in Marketing (CAN-SPAM, GDPR, Privacy Sandbox)', category: 'Compliance', weight: 0.8 }
    ],
    keywords: [
      'seo', 'sem', 'google ads', 'meta ads', 'ga4', 'google analytics', 'copywriting', 'content strategy',
      'email marketing', 'hubspot', 'mailchimp', 'a/b testing', 'cro', 'roas', 'cac', 'conversion rate',
      'keyword research', 'wordpress', 'funnel', 'growth marketing', 'campaign'
    ],
    recommendedCourses: [
      { title: 'Google Digital Marketing & E-commerce Certificate', provider: 'Coursera / Google', type: 'Industry Certificate', duration: '6 Weeks' },
      { title: 'HubSpot Inbound & Content Marketing Certification', provider: 'HubSpot Academy (Free)', type: 'Practical Lab', duration: '2 Weeks' },
      { title: 'Google Analytics 4 (GA4) Certification Training', provider: 'Google Skillshop', type: 'Core Competency', duration: '3 Weeks' },
      { title: 'Meta Certified Digital Marketing Associate', provider: 'Meta Blueprint', type: 'Industry Certificate', duration: '4 Weeks' }
    ]
  }
};

/**
 * AI Assessment Scoring Algorithm
 * Calculates an RPL readiness score based on multi-criteria rubric.
 */
class AIEngine {
  /**
   * Evaluates candidate inputs and generates full RPL diagnostic
   * @param {Object} candidateData 
   * @returns {Object} Comprehensive evaluation result
   */
  static evaluate(candidateData) {
    const domainKey = candidateData.domain || 'software-dev';
    const domainDef = RPL_DOMAINS[domainKey] || RPL_DOMAINS['software-dev'];

    // 1. Evaluate Core Competencies & Skills (Max 35 points)
    const skillEvaluation = this.calculateSkillScore(candidateData.skills || [], domainDef);

    // 2. Evaluate Practical Experience & Evidence (Max 30 points)
    const evidenceEvaluation = this.calculateEvidenceScore(candidateData.practicalExperience || '', candidateData.portfolioUrl || '', candidateData.toolsUsed || '', domainDef);

    // 3. Evaluate Work Experience Duration & Relevance (Max 20 points)
    const experienceEvaluation = this.calculateExperienceScore(candidateData.experienceYears || 0, candidateData.employmentType || 'self-employed', candidateData.roleTitle || '');

    // 4. Evaluate Education & Foundational Background (Max 15 points)
    const educationEvaluation = this.calculateEducationScore(candidateData.educationLevel || '', candidateData.certifications || '');

    // Total Score (0 - 100)
    let totalScore = Math.round(
      skillEvaluation.score +
      evidenceEvaluation.score +
      experienceEvaluation.score +
      educationEvaluation.score
    );

    // Cap boundaries
    totalScore = Math.max(12, Math.min(98, totalScore));

    // Determine RPL Qualification Level
    const rplLevel = this.determineRPLLevel(totalScore);

    // Generate Strengths & Gaps
    const strengths = this.generateStrengths(candidateData, domainDef, skillEvaluation, evidenceEvaluation);
    const gaps = this.generateGaps(candidateData, domainDef, skillEvaluation);

    // Generate Tailored Learning Recommendations
    const recommendations = this.generateRecommendations(domainDef, gaps, totalScore);

    // Radar / Categorical Breakdown for Charts
    const radarBreakdown = {
      'Core Competencies': Math.round((skillEvaluation.score / 35) * 100),
      'Practical Evidence': Math.round((evidenceEvaluation.score / 30) * 100),
      'Work Experience': Math.round((experienceEvaluation.score / 20) * 100),
      'Foundational Learning': Math.round((educationEvaluation.score / 15) * 100),
      'Tool & Tech Proficiency': Math.min(100, Math.round(evidenceEvaluation.toolScorePct || 70))
    };

    return {
      id: 'RPL-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      candidateName: candidateData.fullName || 'Candidate',
      candidateEmail: candidateData.email || '',
      domainKey: domainKey,
      domainTitle: domainDef.title,
      overallScore: totalScore,
      rplLevel: rplLevel,
      scores: {
        skills: { earned: Math.round(skillEvaluation.score), max: 35 },
        practical: { earned: Math.round(evidenceEvaluation.score), max: 30 },
        experience: { earned: Math.round(experienceEvaluation.score), max: 20 },
        education: { earned: Math.round(educationEvaluation.score), max: 15 }
      },
      radarBreakdown: radarBreakdown,
      strengths: strengths,
      gaps: gaps,
      recommendations: recommendations,
      assessorNotes: this.generateAssessorNotes(candidateData, totalScore, rplLevel, domainDef),
      isDemo: true
    };
  }

  /**
   * Calculate skill score based on self-reported proficiencies and domain alignment
   */
  static calculateSkillScore(skillsList, domainDef) {
    if (!skillsList || skillsList.length === 0) {
      return { score: 8, matchedCount: 0, highRatedCount: 0 };
    }

    const domainCompMap = new Map();
    domainDef.competencies.forEach(c => domainCompMap.set(c.id, c));

    let weightedEarned = 0;
    let weightedPossible = 0;
    let matchedCount = 0;
    let highRatedCount = 0;

    domainDef.competencies.forEach(comp => {
      weightedPossible += comp.weight * 1.0;
    });

    skillsList.forEach(item => {
      // item = { id, level: 'novice' | 'intermediate' | 'advanced' | 'expert' }
      const comp = domainCompMap.get(item.id);
      const weight = comp ? comp.weight : 0.8;
      let levelMultiplier = 0.3;

      if (item.level === 'intermediate') levelMultiplier = 0.65;
      else if (item.level === 'advanced') levelMultiplier = 0.88;
      else if (item.level === 'expert') levelMultiplier = 1.0;

      if (comp) {
        matchedCount++;
        weightedEarned += weight * levelMultiplier;
        if (item.level === 'advanced' || item.level === 'expert') {
          highRatedCount++;
        }
      } else {
        // Custom added skill
        weightedEarned += 0.5 * levelMultiplier;
      }
    });

    // Score out of 35
    const ratio = Math.min(1.0, weightedEarned / (weightedPossible * 0.85));
    const score = Math.max(5, Math.min(35, ratio * 35));

    return { score, matchedCount, highRatedCount };
  }

  /**
   * Evaluates depth, specificity, tool references, and portfolio evidence in practical descriptions
   */
  static calculateEvidenceScore(practicalText, portfolioUrl, toolsText, domainDef) {
    let score = 5;
    const textLower = (practicalText + ' ' + toolsText).toLowerCase();
    const wordCount = practicalText.trim().split(/\s+/).filter(w => w.length > 0).length;

    // Word count & depth score (0 - 10)
    if (wordCount >= 180) score += 10;
    else if (wordCount >= 100) score += 8;
    else if (wordCount >= 50) score += 5;
    else if (wordCount >= 20) score += 3;

    // Keyword & domain competency match (0 - 12)
    let matchedKeywords = 0;
    domainDef.keywords.forEach(keyword => {
      if (textLower.includes(keyword.toLowerCase())) {
        matchedKeywords++;
      }
    });

    const keywordBonus = Math.min(12, matchedKeywords * 1.5);
    score += keywordBonus;

    // Tools specified (0 - 4)
    if (toolsText && toolsText.trim().length > 5) {
      const toolTokens = toolsText.split(/[,;\n]/).filter(t => t.trim().length > 1);
      score += Math.min(4, toolTokens.length * 0.8);
    }

    // Portfolio / evidence link provided (0 - 4)
    if (portfolioUrl && portfolioUrl.trim().length > 4) {
      if (portfolioUrl.includes('http://') || portfolioUrl.includes('https://') || portfolioUrl.includes('github.com')) {
        score += 4;
      } else {
        score += 2;
      }
    }

    const toolScorePct = Math.min(100, Math.round(((matchedKeywords * 1.8 + (toolsText ? 15 : 0)) / 25) * 100));

    return {
      score: Math.min(30, score),
      matchedKeywords,
      wordCount,
      toolScorePct: Math.max(45, toolScorePct)
    };
  }

  /**
   * Evaluates work experience duration and role relevance
   */
  static calculateExperienceScore(years, employmentType, roleTitle) {
    let score = 0;
    const y = parseFloat(years) || 0;

    // Experience years scale (0 - 13 points)
    if (y >= 5) score += 13;
    else if (y >= 3) score += 11;
    else if (y >= 2) score += 9;
    else if (y >= 1) score += 6;
    else if (y >= 0.5) score += 4;
    else score += 2;

    // Employment type & immersion (0 - 4 points)
    if (employmentType === 'full-time') score += 4;
    else if (employmentType === 'freelance' || employmentType === 'contract') score += 3.5;
    else if (employmentType === 'part-time') score += 2.5;
    else if (employmentType === 'internship' || employmentType === 'apprenticeship') score += 3.0;
    else score += 2.0;

    // Role title specificity (0 - 3 points)
    if (roleTitle && roleTitle.trim().length > 3) {
      score += 3;
    } else {
      score += 1;
    }

    return { score: Math.min(20, score) };
  }

  /**
   * Evaluates formal and informal education credentials
   */
  static calculateEducationScore(educationLevel, certifications) {
    let score = 3;

    // Education baseline (0 - 8 points)
    switch (educationLevel) {
      case 'master':
      case 'phd':
        score += 8;
        break;
      case 'bachelor':
        score += 7;
        break;
      case 'associate':
      case 'diploma':
        score += 6;
        break;
      case 'vocational':
      case 'bootcamp':
        score += 6.5;
        break;
      case 'high-school':
        score += 4;
        break;
      case 'self-taught':
      default:
        score += 5; // In RPL, self-directed learners get recognized fair credit!
        break;
    }

    // Additional certifications or courses (0 - 7 points)
    if (certifications && certifications.trim().length > 5) {
      const certCount = certifications.split(/[,;\n]/).filter(c => c.trim().length > 2).length;
      score += Math.min(7, certCount * 2.5);
    } else {
      score += 2;
    }

    return { score: Math.min(15, score) };
  }

  /**
   * Determines RPL Qualification Readiness Level
   */
  static determineRPLLevel(score) {
    if (score >= 85) {
      return {
        levelNumber: 4,
        badgeText: 'Level 4: Advanced Mastery',
        status: 'Fast-Track RPL Recommended',
        colorClass: 'badge-emerald',
        colorHex: '#059669',
        summary: 'Candidate exhibits comprehensive domain competence with strong practical evidence. Eligible for full RPL qualification credit pending standard verification interview.'
      };
    } else if (score >= 68) {
      return {
        levelNumber: 3,
        badgeText: 'Level 3: Practitioner Competence',
        status: 'Standard RPL Qualified',
        colorClass: 'badge-blue',
        colorHex: '#2563EB',
        summary: 'Candidate demonstrates verified foundational and intermediate skills suitable for formal credit recognition. Recommended for portfolio verification and minor gap review.'
      };
    } else if (score >= 48) {
      return {
        levelNumber: 2,
        badgeText: 'Level 2: Developing Competence',
        status: 'Partial RPL / Bridging Needed',
        colorClass: 'badge-amber',
        colorHex: '#D97706',
        summary: 'Candidate shows promising practical experience in select competencies, but exhibits gaps in theoretical rigor or advanced tooling. Partial RPL granted with targeted bridging modules.'
      };
    } else {
      return {
        levelNumber: 1,
        badgeText: 'Level 1: Foundational Awareness',
        status: 'Pre-RPL Preparation Track',
        colorClass: 'badge-purple',
        colorHex: '#7C3AED',
        summary: 'Candidate demonstrates early-stage or introductory skills. Recommended to complete structured training modules before undertaking formal RPL qualification.'
      };
    }
  }

  /**
   * Generates recognized strengths based on candidate inputs
   */
  static generateStrengths(data, domainDef, skillEval, evidenceEval) {
    const strengths = [];

    // Experience strength
    const years = parseFloat(data.experienceYears) || 0;
    if (years >= 3) {
      strengths.push({
        title: 'Demonstrated Industry Longevity',
        desc: `Over ${years} years of documented practical immersion in ${data.roleTitle || 'the sector'}, exceeding minimum entry tenure thresholds.`
      });
    } else if (years >= 1) {
      strengths.push({
        title: 'Continuous Practical Application',
        desc: `Consistent hands-on tenure (${years} years) establishing a viable foundation for vocational credit.`
      });
    }

    // High skill ratings
    if (data.skills && data.skills.length > 0) {
      const topSkills = data.skills.filter(s => s.level === 'advanced' || s.level === 'expert');
      if (topSkills.length > 0) {
        const topNames = topSkills.slice(0, 3).map(s => {
          const comp = domainDef.competencies.find(c => c.id === s.id);
          return comp ? comp.name : s.id;
        });
        strengths.push({
          title: 'Validated High-Competency Domains',
          desc: `Candidate achieved Advanced/Expert status in primary competencies: ${topNames.join(', ')}.`
        });
      }
    }

    // Evidence depth
    if (evidenceEval.matchedKeywords >= 5 || evidenceEval.wordCount >= 100) {
      strengths.push({
        title: 'Substantive Practical Project Evidence',
        desc: 'Work experience narrative features specific technical terminology, realistic deliverable descriptions, and problem-solving examples.'
      });
    }

    // Portfolio / Live work
    if (data.portfolioUrl && data.portfolioUrl.trim().length > 5) {
      strengths.push({
        title: 'Verifiable Artifacts & Portfolio Links',
        desc: 'Candidate furnished verifiable repository, design portfolio, or public sample URLs supporting prior work claims.'
      });
    }

    // Fallback strength if needed
    if (strengths.length < 2) {
      strengths.push({
        title: 'Self-Directed Vocational Commitment',
        desc: 'Demonstrated proactive career upskilling and aptitude for autonomous competency acquisition.'
      });
    }

    return strengths;
  }

  /**
   * Identifies prioritized skill gaps
   */
  static generateGaps(data, domainDef, skillEval) {
    const gaps = [];
    const candidateSkillMap = new Map();
    (data.skills || []).forEach(s => candidateSkillMap.set(s.id, s.level));

    // Inspect domain required competencies
    domainDef.competencies.forEach(comp => {
      const candidateLevel = candidateSkillMap.get(comp.id);
      if (!candidateLevel || candidateLevel === 'novice') {
        const priority = comp.weight >= 1.1 ? 'High Priority' : 'Medium Priority';
        gaps.push({
          competency: comp.name,
          category: comp.category,
          priority: priority,
          actionRequired: !candidateLevel 
            ? 'Not evidenced in current submission. Recommend bridging mini-module or portfolio artifact.'
            : 'Basic awareness detected; practical application requires further project verification.'
        });
      }
    });

    // If gaps are too few, add an advanced industry standard gap
    if (gaps.length === 0) {
      gaps.push({
        competency: 'Industry Certification & Formal Architectural Documentation',
        category: 'Governance & Standards',
        priority: 'Low Priority',
        actionRequired: 'Recommend sitting for an accredited vendor/framework exam to corroborate mastery.'
      });
    }

    return gaps.slice(0, 4); // Show top 4 most pertinent gaps
  }

  /**
   * Generates actionable recommendations and bridging plans
   */
  static generateRecommendations(domainDef, gaps, totalScore) {
    const recs = [];

    // Course suggestions
    domainDef.recommendedCourses.slice(0, 3).forEach(course => {
      recs.push({
        type: 'Bridging Module',
        title: course.title,
        provider: course.provider,
        duration: course.duration,
        badge: course.type
      });
    });

    // Practical next steps
    if (totalScore >= 75) {
      recs.push({
        type: 'Assessment Step',
        title: 'Schedule Formal Assessor Portfolio Review',
        provider: 'College RPL Committee',
        duration: '1 Hour Interview',
        badge: 'Final Verification'
      });
    } else {
      recs.push({
        type: 'Evidence Enhancement',
        title: 'Construct 1 Capstone Project Evidencing Identified Gaps',
        provider: 'Self-Directed / GitHub / Live Demo',
        duration: '3-4 Weeks',
        badge: 'Portfolio Task'
      });
    }

    return recs;
  }

  /**
   * Generates synthetic assessor evaluation notes
   */
  static generateAssessorNotes(data, score, level, domainDef) {
    return `Preliminary AI diagnostic completed for candidate "${data.fullName || 'Candidate'}" applying under the "${domainDef.title}" RPL rubric. Based on ${data.experienceYears || '0'} years of recorded tenure and project descriptions, the system assessed an overall readiness index of ${score}/100 (${level.badgeText}). ` +
      `This preliminary rating provides indicative guidance for the RPL Academic Board. Candidates are advised to address high-priority gaps in ${domainDef.title} before formal portfolio ratification.`;
  }
}

// Make accessible to window
if (typeof window !== 'undefined') {
  window.AIEngine = AIEngine;
  window.RPL_DOMAINS = RPL_DOMAINS;
}
