# 💼 LinkedIn Job Search Assistant — Chrome Extension

A feature-rich Manifest V3 Chrome extension that analyses LinkedIn job postings, extracts 100+ skills, matches them against your resume profile, generates AI application materials, and tracks your job applications with a full analytics dashboard.

---

## 🚀 Features (All 6 Phases Complete)

- **⚡ Phase 1: Robust Details Extraction**: Instantly extracts Job Title, Company, City, and Full Location from any LinkedIn layout (dual-pane job cards & single-pane direct URLs).
- **🏷️ Phase 2: Skills & Description Engine**: Automatically expands the `... more` section, extracts the complete "About the job" text, and detects 100+ technical skills categorized into 7 domains (*Languages*, *Frontend & Mobile*, *Backend & APIs*, *Cloud & DevOps*, *Databases*, *AI & Data*, *Tools*).
- **👤 Phase 3: Profile & Resume Auto-Extractor**: Save your skills or paste raw resume text to auto-extract technical competencies with 1 click.
- **🎯 Phase 4: Real-time Job Match Score & Gap Analysis**: Dynamic match percentage gauge showing exactly which skills you match (✅) vs what is missing (⚠️) with 1-click addition to your profile.
- **🤖 Phase 5: AI Career Assistant**: Custom Cover Letter Generator (*Professional*, *Enthusiastic*, *Concise*), role-specific Interview Prep Q&A, and ATS Resume Tips. Supports Google Gemini 1.5 Flash API + smart offline built-in AI engine fallback.
- **📊 Phase 6: Job Application Tracker & Dashboard**: 1-click "📌 Track This Job" directly from the popup, mini pipeline tracker, and a dedicated full-page Analytics Dashboard (`tracker.html`) with KPI metrics, status filters, search, notes autosave, and 1-click CSV export!

---

## 📁 Repository Structure

```
linkedin job search chrome extension/
├── .gitignore
├── README.md
└── linkedin-job-extension/
    ├── manifest.json          ← Manifest V3 (activeTab, storage, scripting)
    ├── popup.html             ← 7-tab extension popup
    ├── popup.css              ← Modern styling system & match gauges
    ├── popup.js               ← Full controller: AI engines, match scoring, tracker
    ├── tracker.html           ← Standalone full-page Analytics & Application Tracker
    ├── tracker.css            ← Responsive dashboard stylesheet
    ├── tracker.js             ← Live metrics, search, notes autosave, CSV export
    ├── content.js             ← Scraper & 100+ skill taxonomy engine
    ├── background.js          ← Service worker
    ├── icons/
    │   ├── icon16.png
    │   ├── icon48.png
    │   ├── icon128.png
    │   └── generate-icons.js  ← Pure Node script to generate PNG icons
    └── README.md
```

---

## 🛠️ How to Load in Chrome

1. Clone this repository:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions`
3. Toggle on **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `linkedin-job-extension` folder inside this directory.
5. Open any job posting on LinkedIn (e.g. `https://www.linkedin.com/jobs/...`).
6. Click the 💼 extension icon to start analyzing, matching, generating cover letters, and tracking your jobs!
