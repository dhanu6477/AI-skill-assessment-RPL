# AI-Assisted Skill Assessment Tool for Recognition of Prior Learning (RPL)

> **College Capstone / Degree Project Demonstration Prototype**  
> *A responsive web application that evaluates informal work experience, self-taught proficiencies, and practical portfolios against vocational qualification frameworks.*

---

## 📌 Executive Summary

**Recognition of Prior Learning (RPL)** is an internationally recognized pedagogical framework (endorsed by UNESCO, the ILO, and National Qualification Frameworks) that formally validates competencies acquired outside traditional academic institutions—such as through freelance contracting, self-directed open-source development, or on-the-job training.

Traditional RPL evaluations are notoriously labor-intensive, requiring human assessors to manually comb through unstructured resumes, portfolios, and job histories. 

**SkillBridge RPL** is a modern, client-side web application prototype demonstrating how an intelligent algorithmic rubric can triage candidate submissions, calculate an **RPL Readiness Score (0–100)**, identify verified strengths, detect critical competency gaps, and output an **Official Printable RPL Assessment Transcript**.

---

## 🎯 Key Features

1. **Modern Responsive UI / UX**:
   - Styled with a sleek **blue, white, and purple** color palette.
   - Micro-interactions, accessible form controls, and mobile-friendly drawer navigation.
   - Glassmorphic elevated cards and crisp SVG vector icons.

2. **Multi-Step Assessment Wizard**:
   - **Step 1: Candidate Identification & Education**: Captures legal identity, highest education tier, and informal course credentials.
   - **Step 2: Vocational Track & Tenure**: Supports 6 industry domains (Web Development, Data Analytics & AI, Cloud & DevOps, UI/UX, Cybersecurity, Digital Marketing) and total years of hands-on work.
   - **Step 3: Dynamic Domain Competency Matrix**: Automatically loads benchmark competencies with 4-level proficiency pill selectors (*Novice*, *Intermediate*, *Advanced*, *Expert*) plus custom skill chip additions.
   - **Step 4: Practical Evidence & Project Description**: Collects tooling details, repository/portfolio URLs, project summaries, and ethical candidate attestation.

3. **1-Click Demo Profiles**:
   - Quick-load pre-configured profiles (*Alex Morgan*, *Priya Sharma*, *Jordan Taylor*) to test and demonstrate the evaluation workflow instantly during project reviews or viva presentations.

4. **Multi-Factor AI Assessment Engine**:
   - **Domain Core Competencies (35%)**: Evaluates alignment with benchmark occupational skills.
   - **Practical Evidence & Keyword Parsing (30%)**: Analyzes project descriptions for technical terminology, deliverable complexity, and verifiable portfolio URLs.
   - **Tenure & Engagement Continuity (20%)**: Measures years of practical application and role depth.
   - **Foundational & Non-Formal Learning (15%)**: Accords credit for bootcamps, online credentials, and self-directed learning.

5. **Diagnostic Dashboard & Interactive Visualizations**:
   - **Animated Circular Score Gauge** with RPL Qualification Levels:
     - **Level 4: Advanced Mastery** (85–100 pts) — Fast-Track Full RPL Credit Recommended
     - **Level 3: Practitioner Competence** (68–84 pts) — Standard RPL Qualified / Portfolio Review
     - **Level 2: Developing Competence** (45–67 pts) — Partial RPL / Bridging Modules Needed
     - **Level 1: Foundational Awareness** (0–44 pts) — Preparatory Training Pathway
   - **Interactive Radar Chart** (5-dimensional competency spiderweb via Chart.js).
   - **Horizontal Dimension Bar Chart** with offline SVG/CSS fallback.
   - **Diagnostic Strengths & Prioritized Skill Gaps** (High / Medium / Low).
   - **Personalized Bridging Plan** with curated courses and time commitments.

6. **Assessment History & Registry**:
   - Persists all past evaluations in browser `localStorage`.
   - Real-time search filter by candidate name or domain.
   - "Export All (JSON)", "Clear All", and "Reset Sample Records".

7. **Printable Formal RPL Assessment Transcript**:
   - Dedicated print-optimized modal and `@media print` layout.
   - Formatted for clean **A4 paper and PDF export**.
   - Includes official academic header, candidate dossier, rubric breakdown, assessor signature lines, and academic demo watermark.

8. **Ethical Academic Notice**:
   - Prominently labeled across the site as an educational prototype for college coursework.

---

## 🗂️ Project Directory Structure

```
AI -Skill Assesment/
├── index.html            # Main single-page application structure & modals
├── README.md             # Project documentation & GitHub Pages guide
├── css/
│   ├── style.css         # Modern responsive theme (blue/purple/white, flex/grid)
│   └── print.css         # Dedicated print styles for A4 transcript export
├── js/
│   ├── ai-engine.js      # RPL scoring rubric, competency matrices & gap generator
│   ├── assessment.js     # Form validation, 4-step wizard & demo profile loader
│   ├── dashboard.js      # Visualizations, Chart.js graphs & metric cards
│   ├── history.js        # LocalStorage persistence, JSON export & demo data
│   └── app.js            # Main controller, navigation routing & print modal
└── assets/               # Placeholder for custom branding assets
```

---

## 🚀 How to Run the Website Locally

Because this project is built entirely with client-side **HTML5, CSS3, and modern JavaScript (ES6)**, it has **zero backend installation or build requirements**.

### Method 1: Direct File Open (Simplest)
1. Navigate to the project folder on your computer:
   ```
   c:\Users\Aasika.DESKTOP-NCHDMQ4\Desktop\AI -Skill Assesment
   ```
2. Double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Method 2: Using Visual Studio Code Live Server (Recommended for Development)
1. Open Visual Studio Code and open the `AI -Skill Assesment` folder (`File` > `Open Folder...`).
2. If installed, right-click `index.html` and choose **"Open with Live Server"**.
3. The website will automatically launch at `http://127.0.0.1:5500`.

### Method 3: Using PowerShell Local Server
If you wish to serve over local HTTP using PowerShell:
```powershell
# In the project directory, run:
Start-Process "index.html"
```

---

## 🌐 How to Deploy to GitHub Pages (Free Hosting)

You can deploy this website to GitHub Pages using either of the two methods below:

---

### Option A: Drag-and-Drop via Web Browser (Zero Installation Required - Easiest!)

If you do not have Git installed on your computer, you can publish directly via GitHub's website in 2 minutes:

1. Log in to [GitHub.com](https://github.com).
2. Click the **`+`** icon in the top right corner and choose **"New repository"**.
3. Name your repository: `ai-skill-assessment-rpl`.
4. Keep the repository **Public**, check **"Add a README file"**, and click **"Create repository"**.
5. On your new repository page, click **Add file > Upload files**.
6. Select and drag all files and folders from this folder:
   - `index.html`
   - `README.md`
   - `css/` (both `style.css` and `print.css`)
   - `js/` (all 5 `.js` files)
   - `assets/`
7. Click the green **"Commit changes"** button.
8. Go to **Settings** (tab at the top) > **Pages** (on the left menu).
9. Under **Build and deployment > Branch**, select **`main`** and **`/ (root)`**, then click **Save**.
10. Refresh after 30 seconds. Your live link will appear at:  
    `https://<your-username>.github.io/ai-skill-assessment-rpl/`

---

### Option B: Using Git Command Line (If Git is Installed)

```powershell
cd "c:\Users\Aasika.DESKTOP-NCHDMQ4\Desktop\AI -Skill Assesment"
git init
git add .
git commit -m "Initial commit: AI-Assisted Skill Assessment Tool for RPL"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/ai-skill-assessment-rpl.git
git push -u origin main
```
Then navigate to **Settings > Pages** on GitHub and enable deployment from the `main` branch.

---

## 🎓 College Viva & Presentation Guide

### Common Questions & Prepared Answers

| Question | Recommended Answer |
|---|---|
| **What is RPL?** | Recognition of Prior Learning (RPL) is a formal assessment process that acknowledges competencies and knowledge an individual has acquired through informal learning, independent study, or industry employment, offering academic or vocational course credits. |
| **Why introduce AI into RPL?** | Traditional RPL processes suffer from high administrative triage costs. An AI preliminary assessment automates the initial gap analysis, maps applicant portfolios against national competency rubrics, and advises applicants on exact missing modules *before* expensive human committee review. |
| **How does the scoring algorithm work?** | Our multi-factor rubric assigns 35% to core domain competencies, 30% to practical project depth and technical keyword evidence, 20% to verified work tenure continuity, and 15% to foundational and non-formal credentials. |
| **Is this certified by an accrediting body?** | No. This is clearly labeled as an educational prototype for demonstration. In real-world accredited systems, AI serves as an advisory decision-support tool; final credit ratification always requires an accredited human assessor. |

---

## ⚖️ Academic License & Disclaimer

This project is released for academic coursework and portfolio display purposes. The assessment results and recommendations generated by this software are algorithmic simulations and do not represent formal accreditation or vocational certification from any licensing board.
