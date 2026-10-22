# 💼 Job Search Assistant — Chrome Extension

A Chrome extension that analyses LinkedIn job postings, matches them against your skills, generates AI application materials, and tracks your applications — built in **6 phases**.

---

## Phase Status

| # | Feature | Status |
|---|---------|--------|
| 1 | Basic extension — extract job title, company, location | ✅ Complete |
| 2 | Full job description + skill extraction engine | ✅ Complete |
| 3 | User resume / skill profile | ✅ Complete |
| 4 | Real-time Job match score & Gap analysis | ✅ Complete |
| 5 | AI-powered analysis (Cover letters, Interview Q&A, ATS Tips) | ✅ Complete |
| 6 | Job application tracker & analytics dashboard | ✅ Complete |

---

## What It Does

Open any LinkedIn job posting and the extension automatically:

| Feature | Description |
|---|---|
| **Core Details** | Extracts **Job Title**, **Company**, **City**, and **Location**. |
| **Description** | Extracts full **About the job** description with word/char count. |
| **Skill Extraction** | Scans and categorizes 100+ technical skills into 7 domains. |
| **My Profile (Phase 3)** | Save your skills, pick from suggestions, or paste your raw resume to auto-extract your skills. |
| **Match Score (Phase 4)** | Instant match percentage (e.g. `82% Match`) with breakdown of **Matched Skills** vs **Missing Gap Skills**. |
| **AI Career Assistant (Phase 5)** | Generates tailored **Cover Letters**, role-specific **Interview Prep Q&A**, and **ATS Resume Tips**. Supports both Google Gemini 1.5 Flash and a smart built-in AI engine. |
| **Application Tracker (Phase 6)** | 1-Click "📌 Track This Job" to organize applications into *Saved*, *Applied*, *Interviewing*, *Offer*, and *Rejected*. |
| **Full Analytics Dashboard (Phase 6)** | Standalone full-page dashboard (`tracker.html`) with KPI metric cards, status filters, live search, and notes autosave. |
| **1-Click CSV Export** | Export your entire job pipeline to CSV for spreadsheet analysis or backup. |
| **Offline Persistence** | Remembers your saved skills, tracked jobs, and last scanned posting via `chrome.storage.local`. |

---

## Extension Interface Overview

1. **📋 Overview**: Title, Company, City, Location, Match Score Gauge, **📌 Track This Job** button, and quick skill pills.
2. **🎯 Match**: Detailed breakdown of ✅ **Matched Skills** vs ⚠️ **Missing Gap Skills** (click any missing skill to add it to your profile).
3. **🏷️ Skills**: All job skills categorized by *Languages*, *Frontend & Mobile*, *Backend & APIs*, *Cloud & DevOps*, *Databases*, *AI & Data*, and *Tools*.
4. **🤖 AI Tools**:
   - **📝 Cover Letter**: Generates a tailored 3-paragraph letter with tone options (*Professional*, *Enthusiastic*, *Concise*).
   - **🎯 Interview Prep**: Tailored technical questions, behavioral scenarios, and smart questions to ask the interviewer.
   - **✨ ATS Resume Tips**: Action-oriented resume bullet points and key ATS keywords to include.
   - **Dual AI Engine**: Uses Google Gemini 1.5 Flash when an API key is provided, with an intelligent built-in generative engine as fallback.
5. **📊 Tracker**:
   - Quick pipeline summary counts (*Total*, *Applied*, *Interview*, *Offers*, *Avg Match*).
   - List of recent tracked jobs with direct LinkedIn links, match scores, and status tags.
   - **🚀 Full Dashboard ↗** button to open the full-screen analytics dashboard.
   - **📥 Export CSV** button.
6. **👤 Profile**: Manage your skills list, use quick suggestions, or paste your resume for 1-click auto-extraction.
7. **📄 Details**: Read the full formatted job description with one-click copy.

---

## Folder Structure

```
linkedin-job-extension/
├── manifest.json          ← Chrome Extension Manifest V3 (activeTab, storage, scripting)
├── popup.html             ← 7-tab UI (Overview, Match, Skills, AI Tools, Tracker, Profile, Details)
├── popup.css              ← Modern styling, match gauges, AI result cards, tracker list
├── popup.js               ← Full controller: scraping, AI engines, match scoring, tracker pipeline
├── tracker.html           ← Standalone full-page Analytics & Application Tracker Dashboard
├── tracker.css            ← Responsive dashboard stylesheet (metric cards, search, status pills)
├── tracker.js             ← Dashboard controller: live metrics, filters, notes editing, CSV exporter
├── content.js             ← Scraper, DOM traverser & 100+ skill taxonomy engine
├── background.js          ← Service worker (lifecycle events)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── generate-icons.js  ← Generates PNG icons with zero npm dependencies
└── README.md
```

---

## Installation & How to Use

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked** (or click **🔄 Reload** on the "Job Search Assistant" card if already loaded)
4. Select the `linkedin-job-extension/` folder
5. Go to any LinkedIn job posting (e.g. `https://www.linkedin.com/jobs/...`)
6. Click the 💼 extension icon:
   - Click **"📌 Track This Job"** on the Overview tab to save it to your pipeline.
   - Change the status dropdown to *Applied*, *Interviewing*, or *Offer*.
   - Click **"📊 Dashboard"** in the header or the **📊 Tracker** tab to open the full analytics dashboard (`tracker.html`)!
   - Click **"📥 Export CSV"** anytime to download your applications spreadsheet.
