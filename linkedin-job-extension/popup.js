/**
 * popup.js — Phase 5: AI-Powered Career Assistant
 *
 * Capabilities:
 *  1. Extracts job details, description, and skills via content.js
 *  2. Skills Profile Manager with resume auto-extraction (Phase 3)
 *  3. Real-Time Job Match Score & Gap Analysis (Phase 4)
 *  4. AI Career Assistant (Phase 5):
 *     - Custom Cover Letter Generator (Professional, Enthusiastic, Concise)
 *     - Role-Specific Interview Questions & Talking Points
 *     - ATS Resume Optimization Tips & Bullet Point Crafter
 *     - Dual-Engine: Live Google Gemini 1.5 Flash + Smart Built-in Generative AI Engine
 */

// ── DOM Elements ──────────────────────────────────────────────
var statusBanner        = document.getElementById("status-banner");
var statusIcon          = document.getElementById("status-icon");
var statusText          = document.getElementById("status-text");

var jobContent          = document.getElementById("job-content");
var noJobCard           = document.getElementById("no-job-card");
var btnExtract          = document.getElementById("btn-extract");

// Tab Navigation
var tabButtons          = document.querySelectorAll(".tab-btn");
var tabPanels           = document.querySelectorAll(".tab-panel");
var tabSkillsCount      = document.getElementById("tab-skills-count");
var matchScoreBadge     = document.getElementById("match-score-badge");

// Overview Fields
var overviewMatchBanner = document.getElementById("overview-match-banner");
var matchPercent        = document.getElementById("match-percent");
var matchVerdict        = document.getElementById("match-verdict");
var matchStatsText      = document.getElementById("match-stats-text");
var matchProgressBar    = document.getElementById("match-progress-bar");

var elTitle             = document.getElementById("job-title");
var elCompany           = document.getElementById("job-company");
var elCity              = document.getElementById("job-city");
var elLocation          = document.getElementById("job-location");
var quickSkillsList     = document.getElementById("quick-skills-list");
var quickSkillsCount    = document.getElementById("quick-skills-count");

// Match Tab Fields (Phase 4)
var matchPillBadge      = document.getElementById("match-pill-badge");
var matchedCount        = document.getElementById("matched-count");
var matchedSkillsList   = document.getElementById("matched-skills-list");
var missingCount        = document.getElementById("missing-count");
var missingSkillsList   = document.getElementById("missing-skills-list");

// Skills Tab Fields (Phase 2)
var skillsContainer     = document.getElementById("skills-container");
var noSkillsMsg         = document.getElementById("no-skills-detected");
var btnCopySkills       = document.getElementById("btn-copy-skills");

// AI Tab Fields (Phase 5)
var btnToggleAiSettings = document.getElementById("btn-toggle-ai-settings");
var aiSettingsBox       = document.getElementById("ai-settings-box");
var inputGeminiKey      = document.getElementById("input-gemini-key");
var btnSaveGeminiKey    = document.getElementById("btn-save-gemini-key");
var aiEngineStatus      = document.getElementById("ai-engine-status");

var aiSubtabButtons     = document.querySelectorAll(".ai-subtab-btn");
var subtoolPanels       = document.querySelectorAll(".subtool-panel");

var selectCoverTone     = document.getElementById("select-cover-tone");
var btnGenerateCover    = document.getElementById("btn-generate-cover");

var selectInterview     = document.getElementById("select-interview-focus");
var btnGenerateInterview= document.getElementById("btn-generate-interview");

var selectAtsFocus      = document.getElementById("select-ats-focus");
var btnGenerateAts      = document.getElementById("btn-generate-ats");

var aiLoadingBox        = document.getElementById("ai-loading-box");
var aiResultCard        = document.getElementById("ai-result-card");
var aiResultTitle       = document.getElementById("ai-result-title");
var aiOutputText        = document.getElementById("ai-output-text");
var btnCopyAi           = document.getElementById("btn-copy-ai");

// Profile Tab Fields (Phase 3)
var profileSkillsCount  = document.getElementById("profile-skills-count");
var inputNewSkill       = document.getElementById("input-new-skill");
var btnAddSkill         = document.getElementById("btn-add-skill");
var suggestChips        = document.getElementById("suggest-chips");
var userSkillsList      = document.getElementById("user-skills-list");
var btnClearProfile     = document.getElementById("btn-clear-profile");
var resumeTextInput     = document.getElementById("resume-text-input");
var btnExtractResume    = document.getElementById("btn-extract-resume");

// Description Fields
var elDescText          = document.getElementById("job-description-text");
var elDescWordCount     = document.getElementById("desc-word-count");
var btnCopyDesc         = document.getElementById("btn-copy-desc");

// Tracker Fields (Phase 6)
var btnHeaderDashboard  = document.getElementById("btn-header-dashboard");
var tabTrackerCount     = document.getElementById("tab-tracker-count");
var btnTrackJob         = document.getElementById("btn-track-job");
var trackBtnIcon        = document.getElementById("track-btn-icon");
var trackBtnText        = document.getElementById("track-btn-text");
var trackedStatusControls = document.getElementById("tracked-status-controls");
var selectJobStatus     = document.getElementById("select-job-status");

var btnOpenDashboard    = document.getElementById("btn-open-dashboard");
var btnExportCsvPopup   = document.getElementById("btn-export-csv-popup");

var miniMetricTotal     = document.getElementById("mini-metric-total");
var miniMetricApplied   = document.getElementById("mini-metric-applied");
var miniMetricInterview = document.getElementById("mini-metric-interview");
var miniMetricOffers    = document.getElementById("mini-metric-offers");
var miniMetricAvg       = document.getElementById("mini-metric-avg");

var popupTrackerList    = document.getElementById("popup-tracker-list");
var popupTrackerEmpty   = document.getElementById("popup-tracker-empty");

// State
var currentJobData      = null;
var userSkills          = [];
var geminiApiKey        = "";
var trackedJobs         = [];
var currentMatchScore   = 0;
var currentTabUrl       = "";

var SUGGESTED_SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "Java", "SQL",
  "AWS", "Docker", "Kubernetes", "Git", "REST APIs", "C++", "HTML / CSS"
];

// ── Status Helpers ────────────────────────────────────────────

function showStatus(message, type) {
  type = type || "info";
  var icons = { info: "ℹ️", success: "✅", error: "❌" };

  statusBanner.className = "status-banner " + type;
  statusIcon.textContent = icons[type] || "ℹ️";
  statusText.textContent = message;
  statusBanner.classList.remove("hidden");
}

function hideStatus() {
  statusBanner.classList.add("hidden");
}

// ── Tab Switching ─────────────────────────────────────────────

function setupTabs() {
  tabButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      var targetId = btn.getAttribute("data-tab");

      tabButtons.forEach(function(b) { b.classList.remove("active"); });
      tabPanels.forEach(function(p) { p.classList.remove("active"); p.classList.add("hidden"); });

      btn.classList.add("active");
      var targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.remove("hidden");
        targetPanel.classList.add("active");
      }
    });
  });
}

function setupAiSubtabs() {
  aiSubtabButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      var targetSub = btn.getAttribute("data-subtool");

      aiSubtabButtons.forEach(function(b) { b.classList.remove("active"); });
      subtoolPanels.forEach(function(p) { p.classList.add("hidden"); });

      btn.classList.add("active");
      var activePanel = document.getElementById("subtool-" + targetSub);
      if (activePanel) {
        activePanel.classList.remove("hidden");
      }
    });
  });

  btnToggleAiSettings.addEventListener("click", function() {
    aiSettingsBox.classList.toggle("hidden");
  });

  btnSaveGeminiKey.addEventListener("click", function() {
    geminiApiKey = (inputGeminiKey.value || "").trim();
    chrome.storage.local.set({ geminiApiKey: geminiApiKey }, function() {
      updateAiEngineStatus();
      showStatus("Gemini API key saved!", "success");
      aiSettingsBox.classList.add("hidden");
    });
  });
}

function updateAiEngineStatus() {
  if (geminiApiKey) {
    aiEngineStatus.textContent = "🟢 Live Gemini 1.5 Flash Active";
    aiEngineStatus.style.color = "#047857";
    btnToggleAiSettings.innerHTML = "<span>⚙️</span> Key Set";
  } else {
    aiEngineStatus.textContent = "⚡ Built-in AI Engine Active";
    aiEngineStatus.style.color = "#4338ca";
    btnToggleAiSettings.innerHTML = "<span>⚙️</span> API Key";
  }
}

// ── AI Engine Core (Phase 5) ──────────────────────────────────

function callGeminiAI(prompt, callback) {
  if (!geminiApiKey) {
    callback(null); // Fallback to built-in generator
    return;
  }

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + encodeURIComponent(geminiApiKey);

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    })
  })
  .then(function(res) {
    if (!res.ok) throw new Error("API status " + res.status);
    return res.json();
  })
  .then(function(json) {
    var text = json && json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts && json.candidates[0].content.parts[0] && json.candidates[0].content.parts[0].text;
    if (text) {
      callback(text);
    } else {
      callback(null);
    }
  })
  .catch(function(err) {
    console.warn("[Job Search Assistant] Gemini API error, falling back to built-in AI:", err);
    callback(null);
  });
}

// ── Smart Built-in Generative AI Templates ────────────────────

function generateSmartCoverLetter(title, company, location, matchedSkills, allUserSkills, tone) {
  var topSkills = matchedSkills.length > 0 ? matchedSkills.slice(0, 4).join(", ") : allUserSkills.slice(0, 4).join(", ");
  var roleTitle = title || "the role";
  var compName  = company || "your organization";
  var locText   = location ? " in " + location : "";

  var intro = "";
  var body = "";
  var closing = "";

  if (tone === "enthusiastic") {
    intro = "Dear Hiring Team,\n\nI was thrilled to come across the " + roleTitle + " opportunity at " + compName + locText + ". Having developed a strong background across " + topSkills + ", I am deeply excited by " + compName + "'s mission and the technological challenges your engineering team tackles.";
    body = "Throughout my work, I have focused on building resilient, maintainable software and delivering high-impact solutions. My experience with " + (matchedSkills[0] || "modern software engineering") + " and " + (matchedSkills[1] || "core architecture") + " aligns directly with what you are seeking in this role. I thrive in dynamic environments where collaborative problem-solving and clean code drive customer success.";
    closing = "I would love the opportunity to contribute my energy, technical capabilities, and dedication to " + compName + ". Thank you for your time and consideration—I look forward to discussing how my background can support your upcoming milestones.\n\nWarm regards,\n[Your Name]";
  } else if (tone === "concise") {
    intro = "Dear Hiring Manager,\n\nI am writing to express my strong interest in the " + roleTitle + " position at " + compName + locText + ".";
    body = "Key qualifications I bring to your team:\n• Core expertise in " + topSkills + ".\n• Proven ability to design, implement, and maintain robust technical solutions.\n• Quick learner who thrives in fast-paced software environments and aligns engineering execution with product goals.";
    closing = "I welcome the opportunity to speak with you regarding how my technical skill set aligns with " + compName + "'s immediate objectives.\n\nSincerely,\n[Your Name]";
  } else {
    // Professional (default)
    intro = "Dear Hiring Team at " + compName + ",\n\nI am writing to apply for the " + roleTitle + " position" + locText + ". With a strong foundation in modern software development and hands-on proficiency in " + topSkills + ", I am confident in my ability to make an immediate, positive contribution to your team.";
    body = "In reviewing the requirements for " + roleTitle + ", my background in " + (matchedSkills[0] || "software design") + " and " + (matchedSkills[1] || "system implementation") + " closely matches the technical scope of this position. I pride myself on writing clean, scalable code and collaborating effectively across teams to deliver measurable business value.";
    closing = "I would welcome the opportunity to discuss my qualifications and how my background aligns with " + compName + "'s vision. Thank you for your time and consideration.\n\nSincerely,\n[Your Name]";
  }

  return intro + "\n\n" + body + "\n\n" + closing;
}

function generateSmartInterviewPrep(title, company, matchedSkills, missingSkills) {
  var roleTitle = title || "Software Engineer";
  var comp = company || "the company";
  var s1 = matchedSkills[0] || "system design";
  var s2 = matchedSkills[1] || "data structures";
  var m1 = missingSkills[0] || "cloud architecture";

  return "🎯 TOP INTERVIEW PREPARATION GUIDE FOR " + roleTitle.toUpperCase() + " AT " + comp.toUpperCase() + "\n\n" +
    "1. Technical Competency (Based on Required Skills):\n" +
    "   Q: How do you design, optimize, and test applications built using " + s1 + "?\n" +
    "   💡 Talking Point: Explain a concrete project where you used " + s1 + ". Highlight concurrency, error handling, and performance trade-offs.\n\n" +
    "2. Problem Solving & Architecture:\n" +
    "   Q: Can you walk us through a challenging architectural decision you made involving " + s2 + "?\n" +
    "   💡 Talking Point: Frame your answer using the STAR method (Situation, Task, Action, Result). Quantify performance gains or reliability improvements.\n\n" +
    "3. Skill Gap / Rapid Learning:\n" +
    "   Q: How comfortable are you picking up " + m1 + " in our production environment?\n" +
    "   💡 Talking Point: Emphasize your strong foundation in " + s1 + " and give an example of a tool or framework you learned rapidly on the job.\n\n" +
    "4. Smart Questions to Ask the Hiring Team:\n" +
    "   • \"What does the technical roadmap for the " + roleTitle + " team look like over the next 6-12 months?\"\n" +
    "   • \"How does " + comp + " handle technical debt, testing, and CI/CD deployment cycles?\"";
}

function generateSmartAtsTips(title, company, matchedSkills, missingSkills) {
  var roleTitle = title || "Software Engineer";
  var topM = matchedSkills.slice(0, 3);
  var topMiss = missingSkills.slice(0, 3);

  return "⚡ ATS RESUME OPTIMIZATION & TAILORING FOR " + roleTitle.toUpperCase() + "\n\n" +
    "1. High-Impact Action Bullet Points to Add:\n" +
    "   • \"Architected and delivered scalable features utilizing " + (topM[0] || "core frameworks") + " and " + (topM[1] || "APIs") + ", improving system throughput by 25%.\"\n" +
    "   • \"Collaborated in an Agile team to develop, test, and deploy resilient services using " + (topM[1] || "backend tools") + ", reducing release cycle times.\"\n" +
    "   • \"Optimized database queries and API endpoints, ensuring 99.9% uptime and streamlined user response latency.\"\n\n" +
    "2. Critical Keywords for ATS Scanner:\n" +
    "   Include these verbatim in your Skills or Summary section:\n" +
    "   [" + (matchedSkills.concat(missingSkills)).slice(0, 8).join(" • ") + "]\n\n" +
    "3. Bridging Skill Gaps (" + (topMiss.length > 0 ? topMiss.join(", ") : "None") + "):\n" +
    "   • If you have academic, hobby, or adjacent experience with " + (topMiss[0] || "emerging tools") + ", list it under 'Familiar Technologies' or 'Projects'.";
}

// ── Setup AI Button Handlers ──────────────────────────────────

function setupAiActions() {
  btnCopyAi.addEventListener("click", function() {
    var text = (aiOutputText.textContent || "").trim();
    if (!text) return;
    navigator.clipboard.writeText(text).then(function() {
      var orig = btnCopyAi.innerHTML;
      btnCopyAi.innerHTML = "<span>✓</span> Copied!";
      setTimeout(function() { btnCopyAi.innerHTML = orig; }, 1500);
    });
  });

  // 1. Cover Letter Generator
  btnGenerateCover.addEventListener("click", function() {
    if (!currentJobData) {
      showStatus("Please extract job details first.", "error");
      return;
    }

    var tone = selectCoverTone.value;
    aiLoadingBox.classList.remove("hidden");
    aiResultCard.classList.add("hidden");

    var matched = getMatchedSkills();
    var prompt = "Write a tailored, highly professional " + tone + " cover letter for the position of " + currentJobData.title + " at " + currentJobData.company + (currentJobData.location ? " in " + currentJobData.location : "") + ".\n" +
      "The applicant has verified skills in: " + userSkills.join(", ") + ".\n" +
      "Job requirements include: " + (currentJobData.skills ? currentJobData.skills.all.join(", ") : "software engineering skills") + ".\n" +
      "Ensure the letter mentions how the applicant's specific skills align directly with the role and demonstrates enthusiasm for the company. Do not use generic placeholders like [Company Name] where the actual name is provided.";

    callGeminiAI(prompt, function(aiText) {
      aiLoadingBox.classList.add("hidden");
      var finalOutput = aiText || generateSmartCoverLetter(currentJobData.title, currentJobData.company, currentJobData.location, matched, userSkills, tone);
      aiResultTitle.textContent = "Custom Cover Letter (" + tone.toUpperCase() + ")";
      aiOutputText.textContent = finalOutput;
      aiResultCard.classList.remove("hidden");
    });
  });

  // 2. Interview Prep Generator
  btnGenerateInterview.addEventListener("click", function() {
    if (!currentJobData) {
      showStatus("Please extract job details first.", "error");
      return;
    }

    var focus = selectInterview.value;
    aiLoadingBox.classList.remove("hidden");
    aiResultCard.classList.add("hidden");

    var matched = getMatchedSkills();
    var missing = getMissingSkills();

    var prompt = "Generate a comprehensive interview preparation guide for the role of " + currentJobData.title + " at " + currentJobData.company + ".\n" +
      "Candidate's matching skills: " + matched.join(", ") + ".\n" +
      "Job skill gaps: " + missing.join(", ") + ".\n" +
      "Focus area: " + focus + ".\n" +
      "Provide 4 realistic interview questions, key talking points connecting the candidate's skills, and 2 insightful questions for the candidate to ask the interviewer.";

    callGeminiAI(prompt, function(aiText) {
      aiLoadingBox.classList.add("hidden");
      var finalOutput = aiText || generateSmartInterviewPrep(currentJobData.title, currentJobData.company, matched, missing);
      aiResultTitle.textContent = "Interview Q&A Prep (" + focus.toUpperCase() + ")";
      aiOutputText.textContent = finalOutput;
      aiResultCard.classList.remove("hidden");
    });
  });

  // 3. ATS Resume Tips Generator
  btnGenerateAts.addEventListener("click", function() {
    if (!currentJobData) {
      showStatus("Please extract job details first.", "error");
      return;
    }

    var focus = selectAtsFocus.value;
    aiLoadingBox.classList.remove("hidden");
    aiResultCard.classList.add("hidden");

    var matched = getMatchedSkills();
    var missing = getMissingSkills();

    var prompt = "Provide targeted ATS resume optimization advice for a candidate applying to " + currentJobData.title + " at " + currentJobData.company + ".\n" +
      "Matched skills: " + matched.join(", ") + ".\n" +
      "Missing skills: " + missing.join(", ") + ".\n" +
      "Provide 3 high-impact resume bullet points using the Action Verb + Context + Result formula, and list essential keywords to pass the ATS filter.";

    callGeminiAI(prompt, function(aiText) {
      aiLoadingBox.classList.add("hidden");
      var finalOutput = aiText || generateSmartAtsTips(currentJobData.title, currentJobData.company, matched, missing);
      aiResultTitle.textContent = "ATS Resume Optimization Tips";
      aiOutputText.textContent = finalOutput;
      aiResultCard.classList.remove("hidden");
    });
  });
}

function getMatchedSkills() {
  if (!currentJobData || !currentJobData.skills || !currentJobData.skills.all) return [];
  var userNorm = userSkills.map(normalizeSkill);
  return currentJobData.skills.all.filter(function(js) {
    var jNorm = normalizeSkill(js);
    return userNorm.some(function(un) {
      return un === jNorm || (un.length > 3 && jNorm.indexOf(un) !== -1) || (jNorm.length > 3 && un.indexOf(jNorm) !== -1);
    });
  });
}

function getMissingSkills() {
  if (!currentJobData || !currentJobData.skills || !currentJobData.skills.all) return [];
  var matched = getMatchedSkills();
  return currentJobData.skills.all.filter(function(js) {
    return matched.indexOf(js) === -1;
  });
}

// ── User Skills Profile (Phase 3) ─────────────────────────────

function loadUserProfile(callback) {
  chrome.storage.local.get(["userSkills", "geminiApiKey"], function(result) {
    if (result && Array.isArray(result.userSkills)) {
      userSkills = result.userSkills;
    } else {
      userSkills = ["JavaScript", "Python", "SQL", "Git"];
      saveUserProfile();
    }

    if (result && result.geminiApiKey) {
      geminiApiKey = result.geminiApiKey;
      inputGeminiKey.value = geminiApiKey;
    }
    updateAiEngineStatus();
    renderUserProfile();
    if (callback) callback();
  });
}

function saveUserProfile() {
  chrome.storage.local.set({ userSkills: userSkills }, function() {
    renderUserProfile();
    if (currentJobData) {
      calculateAndRenderMatch();
    }
  });
}

function addUserSkill(skillName) {
  if (!skillName) return;
  var trimmed = skillName.trim();
  if (!trimmed) return;

  var exists = userSkills.some(function(s) {
    return s.toLowerCase() === trimmed.toLowerCase();
  });

  if (!exists) {
    userSkills.push(trimmed);
    saveUserProfile();
  }
}

function removeUserSkill(index) {
  userSkills.splice(index, 1);
  saveUserProfile();
}

function renderUserProfile() {
  profileSkillsCount.textContent = userSkills.length + " saved";
  userSkillsList.innerHTML = "";

  if (userSkills.length === 0) {
    userSkillsList.innerHTML = '<span class="empty-note">No skills saved yet. Add your skills above or paste your resume!</span>';
    return;
  }

  userSkills.forEach(function(skill, index) {
    var tag = document.createElement("span");
    tag.className = "skill-tag-removable";
    tag.textContent = skill;

    var removeBtn = document.createElement("button");
    removeBtn.className = "tag-remove-btn";
    removeBtn.innerHTML = "×";
    removeBtn.title = "Remove " + skill;
    removeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      removeUserSkill(index);
    });

    tag.appendChild(removeBtn);
    userSkillsList.appendChild(tag);
  });
}

function renderSuggestChips() {
  suggestChips.innerHTML = "";
  SUGGESTED_SKILLS.forEach(function(s) {
    var chip = document.createElement("button");
    chip.className = "chip-btn";
    chip.textContent = "+ " + s;
    chip.addEventListener("click", function() {
      addUserSkill(s);
    });
    suggestChips.appendChild(chip);
  });
}

function setupProfileActions() {
  btnAddSkill.addEventListener("click", function() {
    var val = inputNewSkill.value;
    if (val) {
      addUserSkill(val);
      inputNewSkill.value = "";
      inputNewSkill.focus();
    }
  });

  inputNewSkill.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      var val = inputNewSkill.value;
      if (val) {
        addUserSkill(val);
        inputNewSkill.value = "";
      }
    }
  });

  btnClearProfile.addEventListener("click", function() {
    if (confirm("Clear all your saved profile skills?")) {
      userSkills = [];
      saveUserProfile();
    }
  });

  btnExtractResume.addEventListener("click", function() {
    var resumeText = (resumeTextInput.value || "").trim();
    if (!resumeText) {
      showStatus("Please paste your resume text first.", "error");
      return;
    }

    var addedCount = 0;
    SUGGESTED_SKILLS.concat([
      "Java", "C++", "C#", "Golang", "Rust", "Ruby", "PHP", "Kotlin", "Swift", "Dart",
      "React Native", "Angular", "Vue.js", "Next.js", "HTML", "CSS", "Tailwind CSS",
      "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", ".NET", "GraphQL",
      "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra",
      "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux", "Jenkins",
      "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Pandas", "NumPy",
      "Unit Testing", "System Design", "Agile", "Scrum"
    ]).forEach(function(skill) {
      var pattern = new RegExp("\\b" + skill.replace(/[\.\+\#]/g, "\\$&") + "\\b", "i");
      if (pattern.test(resumeText)) {
        var exists = userSkills.some(function(s) { return s.toLowerCase() === skill.toLowerCase(); });
        if (!exists) {
          userSkills.push(skill);
          addedCount++;
        }
      }
    });

    saveUserProfile();
    resumeTextInput.value = "";
    showStatus("Extracted and saved " + addedCount + " new skills from your resume!", "success");
  });
}

// ── Match Score Engine (Phase 4) ──────────────────────────────

function normalizeSkill(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function calculateAndRenderMatch() {
  if (!currentJobData || !currentJobData.skills) return;

  var jobSkills = currentJobData.skills.all || [];
  var matched = getMatchedSkills();
  var missing = getMissingSkills();

  var score = 0;
  if (jobSkills.length > 0) {
    score = Math.round((matched.length / jobSkills.length) * 100);
  }
  currentMatchScore = score;

  var tierClass = "match-low";
  var pillClass = "score-low";
  var badgeScoreClass = "score-low";
  var verdict = "📚 Skill Gap — Key requirements missing";

  if (score >= 70) {
    tierClass = "match-high";
    pillClass = "score-high";
    badgeScoreClass = "score-high";
    verdict = "🌟 Strong Match — High skill alignment!";
  } else if (score >= 40) {
    tierClass = "match-medium";
    pillClass = "score-medium";
    badgeScoreClass = "score-medium";
    verdict = "⚡ Moderate Match — You meet core requirements";
  }

  matchScoreBadge.textContent = score + "%";
  matchScoreBadge.className = "badge-score " + badgeScoreClass;
  matchScoreBadge.classList.remove("hidden");

  overviewMatchBanner.className = "match-summary-card " + tierClass;
  overviewMatchBanner.classList.remove("hidden");
  matchPercent.textContent = score + "%";
  matchVerdict.textContent = verdict;
  matchStatsText.textContent = matched.length + " of " + jobSkills.length + " skills matched (" + userSkills.length + " in profile)";
  matchProgressBar.style.width = score + "%";

  matchPillBadge.textContent = score + "% Match";
  matchPillBadge.className = "score-pill " + pillClass;

  matchedCount.textContent = matched.length;
  matchedSkillsList.innerHTML = "";
  if (matched.length > 0) {
    matched.forEach(function(s) {
      var pill = document.createElement("span");
      pill.className = "skill-pill-matched";
      pill.textContent = "✓ " + s;
      matchedSkillsList.appendChild(pill);
    });
  } else {
    matchedSkillsList.innerHTML = '<span class="empty-note">No matching skills yet. Add more skills to your profile!</span>';
  }

  missingCount.textContent = missing.length;
  missingSkillsList.innerHTML = "";
  if (missing.length > 0) {
    missing.forEach(function(s) {
      var pill = document.createElement("span");
      pill.className = "skill-pill-missing";
      pill.textContent = "+ " + s;
      pill.title = "Click to add " + s + " to your profile";
      pill.style.cursor = "pointer";
      pill.addEventListener("click", function() {
        addUserSkill(s);
      });
      missingSkillsList.appendChild(pill);
    });
  } else {
    missingSkillsList.innerHTML = '<span class="empty-note">🎉 No missing skills! You match 100% of detected requirements!</span>';
  }
}

// ── Render Extracted Job Data ─────────────────────────────────

function sanitizeCategoryClass(catName) {
  return "cat-" + (catName || "General").replace(/[^a-zA-Z0-9]/g, "-");
}

function showJobData(data) {
  currentJobData = data;

  elTitle.textContent    = data.title    || "Not found";
  elCompany.textContent  = data.company  || "Not found";
  elCity.textContent     = data.city     || data.location || "Not found";
  elLocation.textContent = data.location || "Not found";

  var skills = data.skills || { all: [], byCategory: {} };
  var totalCount = skills.all ? skills.all.length : 0;

  tabSkillsCount.textContent   = totalCount;
  quickSkillsCount.textContent = totalCount + " found";

  quickSkillsList.innerHTML = "";
  if (totalCount > 0) {
    var maxQuick = Math.min(totalCount, 8);
    for (var i = 0; i < maxQuick; i++) {
      var qPill = document.createElement("span");
      qPill.className = "skill-pill cat-Languages";
      qPill.textContent = skills.all[i];
      quickSkillsList.appendChild(qPill);
    }
    if (totalCount > 8) {
      var morePill = document.createElement("span");
      morePill.className = "skill-pill";
      morePill.style.background = "#e2e8f0";
      morePill.style.color = "#475569";
      morePill.textContent = "+" + (totalCount - 8) + " more";
      quickSkillsList.appendChild(morePill);
    }
  } else {
    quickSkillsList.innerHTML = '<span class="empty-note">No technical skills detected in the description.</span>';
  }

  skillsContainer.innerHTML = "";
  var categories = Object.keys(skills.byCategory || {});

  if (categories.length > 0) {
    noSkillsMsg.classList.add("hidden");
    skillsContainer.classList.remove("hidden");

    categories.forEach(function(cat) {
      var catList = skills.byCategory[cat];
      if (!catList || !catList.length) return;

      var groupDiv = document.createElement("div");
      groupDiv.className = "category-group";

      var label = document.createElement("div");
      label.className = "category-label";
      label.textContent = cat + " (" + catList.length + ")";
      groupDiv.appendChild(label);

      var pillsDiv = document.createElement("div");
      pillsDiv.className = "category-pills";

      catList.forEach(function(skillName) {
        var pill = document.createElement("span");
        pill.className = "skill-pill " + sanitizeCategoryClass(cat);
        pill.textContent = skillName;
        pillsDiv.appendChild(pill);
      });

      groupDiv.appendChild(pillsDiv);
      skillsContainer.appendChild(groupDiv);
    });
  } else {
    skillsContainer.classList.add("hidden");
    noSkillsMsg.classList.remove("hidden");
  }

  var desc = data.description || "";
  if (desc) {
    elDescText.textContent = desc;
    var words = desc.trim().split(/\s+/).length;
    elDescWordCount.textContent = words + " words · " + desc.length + " characters";
  } else {
    elDescText.textContent = "No description could be extracted. Please make sure the job posting has loaded.";
    elDescWordCount.textContent = "0 words";
  }

  calculateAndRenderMatch();
  updateTrackButtonState();

  jobContent.classList.remove("hidden");
  noJobCard.classList.add("hidden");

  try {
    chrome.storage.local.set({ lastExtractedJob: data });
  } catch (e) { /* ignore */ }
}

function showEmptyState() {
  jobContent.classList.add("hidden");
  noJobCard.classList.remove("hidden");
}

function isLinkedInJobPage(url) {
  return typeof url === "string" && url.indexOf("linkedin.com/jobs") !== -1;
}

// ── Copy to Clipboard Helpers ─────────────────────────────────

function setupCopyButtons() {
  btnCopySkills.addEventListener("click", function() {
    if (!currentJobData || !currentJobData.skills || !currentJobData.skills.all || !currentJobData.skills.all.length) {
      showStatus("No skills to copy.", "error");
      return;
    }
    var text = currentJobData.skills.all.join(", ");
    navigator.clipboard.writeText(text).then(function() {
      var original = btnCopySkills.innerHTML;
      btnCopySkills.innerHTML = "<span>✓</span> Copied!";
      setTimeout(function() { btnCopySkills.innerHTML = original; }, 1500);
    });
  });

  btnCopyDesc.addEventListener("click", function() {
    if (!currentJobData || !currentJobData.description) {
      showStatus("No description to copy.", "error");
      return;
    }
    navigator.clipboard.writeText(currentJobData.description).then(function() {
      var original = btnCopyDesc.innerHTML;
      btnCopyDesc.innerHTML = "<span>✓</span> Copied!";
      setTimeout(function() { btnCopyDesc.innerHTML = original; }, 1500);
    });
  });
}

// ── Core Extraction ───────────────────────────────────────────

function extractJob(tab) {
  showStatus("Extracting job details & skills...", "info");
  btnExtract.disabled = true;
  if (tab && tab.url) currentTabUrl = tab.url;

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["content.js"]
    },
    function() {
      if (chrome.runtime.lastError) {
        console.warn("Script injection note:", chrome.runtime.lastError.message);
      }
      runExtraction(tab);
    }
  );
}

function runExtraction(tab) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: function() {
        if (typeof window.extractJobData === "function") {
          return window.extractJobData();
        }
        return null;
      }
    },
    function(results) {
      btnExtract.disabled = false;

      if (chrome.runtime.lastError) {
        console.error("Scripting error:", chrome.runtime.lastError.message);
        showEmptyState();
        showStatus("Error: " + chrome.runtime.lastError.message, "error");
        return;
      }

      var data = results && results[0] && results[0].result;

      if (data && (data.title || data.company)) {
        if (!data.url && tab && tab.url) {
          data.url = tab.url;
        }
        showJobData(data);
        var skillCount = (data.skills && data.skills.totalCount) || 0;
        showStatus("Extracted job details & " + skillCount + " skills!", "success");
      } else {
        showEmptyState();
        showStatus("Could not extract job details. Please ensure the job is selected.", "error");
      }
    }
  );
}

// ── Application Tracker & Pipeline Engine (Phase 6) ───────────

function openFullDashboard() {
  var url = chrome.runtime.getURL("tracker.html");
  chrome.tabs.create({ url: url });
}

function loadTrackedJobs(callback) {
  chrome.storage.local.get("trackedJobs", function(result) {
    trackedJobs = (result && Array.isArray(result.trackedJobs)) ? result.trackedJobs : [];
    renderTrackerUI();
    updateTrackButtonState();
    if (callback) callback();
  });
}

function saveTrackedJobs() {
  chrome.storage.local.set({ trackedJobs: trackedJobs }, function() {
    renderTrackerUI();
    updateTrackButtonState();
  });
}

function findTrackedJob(job) {
  if (!job) return null;
  return trackedJobs.find(function(t) {
    if (job.url && t.url && job.url === t.url) return true;
    var t1 = (job.title || "").toLowerCase().trim();
    var c1 = (job.company || "").toLowerCase().trim();
    var t2 = (t.title || "").toLowerCase().trim();
    var c2 = (t.company || "").toLowerCase().trim();
    return t1.length > 0 && t1 === t2 && c1 === c2;
  });
}

function updateTrackButtonState() {
  if (!btnTrackJob) return;
  var existing = findTrackedJob(currentJobData);

  if (existing) {
    btnTrackJob.className = "btn-track is-tracked";
    trackBtnIcon.textContent = "✓";
    trackBtnText.textContent = "Tracked (" + (existing.status || "Saved") + ")";
    trackedStatusControls.classList.remove("hidden");
    selectJobStatus.value = existing.status || "Saved";
  } else {
    btnTrackJob.className = "btn-track";
    trackBtnIcon.textContent = "📌";
    trackBtnText.textContent = "Track This Job";
    trackedStatusControls.classList.add("hidden");
  }
}

function renderTrackerUI() {
  var total = trackedJobs.length;
  var applied = 0;
  var interview = 0;
  var offers = 0;
  var totalScore = 0;
  var scoredCount = 0;

  trackedJobs.forEach(function(job) {
    var st = (job.status || "Saved").toLowerCase();
    if (st === "applied") applied++;
    else if (st === "interviewing") interview++;
    else if (st === "offer") offers++;

    if (typeof job.matchScore === "number" && job.matchScore > 0) {
      totalScore += job.matchScore;
      scoredCount++;
    }
  });

  var avg = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

  if (tabTrackerCount) tabTrackerCount.textContent = total;
  if (miniMetricTotal) miniMetricTotal.textContent = total;
  if (miniMetricApplied) miniMetricApplied.textContent = applied;
  if (miniMetricInterview) miniMetricInterview.textContent = interview;
  if (miniMetricOffers) miniMetricOffers.textContent = offers;
  if (miniMetricAvg) miniMetricAvg.textContent = avg + "%";

  if (!popupTrackerList) return;
  popupTrackerList.innerHTML = "";

  if (total === 0) {
    popupTrackerEmpty.classList.remove("hidden");
    return;
  }

  popupTrackerEmpty.classList.add("hidden");

  // Show up to 10 most recent tracked jobs in the popup
  var recent = trackedJobs.slice(0, 10);
  recent.forEach(function(job) {
    var card = document.createElement("div");
    card.className = "popup-track-card";

    // Top Row
    var topRow = document.createElement("div");
    topRow.className = "popup-track-top";

    var infoBox = document.createElement("div");
    var titleEl = document.createElement("div");
    titleEl.className = "popup-track-title";
    titleEl.textContent = job.title || "Untitled Role";

    var compEl = document.createElement("div");
    compEl.className = "popup-track-company";
    compEl.textContent = (job.company || "Unknown") + (job.city ? " · " + job.city : "");

    infoBox.appendChild(titleEl);
    infoBox.appendChild(compEl);

    var scoreTag = document.createElement("span");
    var sc = typeof job.matchScore === "number" ? job.matchScore : 0;
    var scClass = sc >= 70 ? "score-high" : (sc >= 40 ? "score-medium" : "score-low");
    scoreTag.className = "badge-score " + scClass;
    scoreTag.textContent = sc + "%";
    scoreTag.title = "Match Score: " + sc + "%";

    topRow.appendChild(infoBox);
    topRow.appendChild(scoreTag);
    card.appendChild(topRow);

    // Bottom Row
    var bottomRow = document.createElement("div");
    bottomRow.className = "popup-track-bottom";

    var status = job.status || "Saved";
    var statusBadge = document.createElement("span");
    statusBadge.className = "popup-status-badge badge-" + status.toLowerCase();
    statusBadge.textContent = status;

    var actionsDiv = document.createElement("div");
    actionsDiv.className = "popup-card-actions";

    if (job.url) {
      var link = document.createElement("a");
      link.href = job.url;
      link.target = "_blank";
      link.className = "popup-btn-icon";
      link.title = "Open job on LinkedIn";
      link.textContent = "↗";
      actionsDiv.appendChild(link);
    }

    var delBtn = document.createElement("button");
    delBtn.className = "popup-btn-icon del";
    delBtn.title = "Delete application";
    delBtn.textContent = "🗑️";
    delBtn.addEventListener("click", function() {
      if (confirm("Remove '" + (job.title || "this job") + "' from tracker?")) {
        var idx = trackedJobs.indexOf(job);
        if (idx !== -1) {
          trackedJobs.splice(idx, 1);
          saveTrackedJobs();
        }
      }
    });
    actionsDiv.appendChild(delBtn);

    bottomRow.appendChild(statusBadge);
    bottomRow.appendChild(actionsDiv);
    card.appendChild(bottomRow);

    popupTrackerList.appendChild(card);
  });
}

function setupTrackerActions() {
  btnTrackJob.addEventListener("click", function() {
    if (!currentJobData || (!currentJobData.title && !currentJobData.company)) {
      showStatus("Please extract a job first before tracking.", "error");
      return;
    }

    var existing = findTrackedJob(currentJobData);
    if (existing) {
      if (confirm("Remove '" + (existing.title || "this job") + "' from your tracker?")) {
        var idx = trackedJobs.indexOf(existing);
        if (idx !== -1) {
          trackedJobs.splice(idx, 1);
          saveTrackedJobs();
          showStatus("Removed from application tracker.", "info");
        }
      }
      return;
    }

    var newEntry = {
      id: "job_" + Date.now(),
      title: currentJobData.title || "Untitled Role",
      company: currentJobData.company || "Unknown Company",
      city: currentJobData.city || "",
      location: currentJobData.location || "",
      url: currentJobData.url || currentTabUrl || "",
      matchScore: currentMatchScore || 0,
      skills: currentJobData.skills || { all: [] },
      dateAdded: new Date().toLocaleDateString(),
      status: selectJobStatus.value || "Saved",
      notes: ""
    };

    trackedJobs.unshift(newEntry);
    saveTrackedJobs();
    showStatus("Added '" + newEntry.title + "' to Tracker!", "success");
  });

  selectJobStatus.addEventListener("change", function() {
    var existing = findTrackedJob(currentJobData);
    if (existing) {
      existing.status = selectJobStatus.value;
      saveTrackedJobs();
      showStatus("Updated status to " + existing.status, "success");
    }
  });

  btnHeaderDashboard.addEventListener("click", openFullDashboard);
  btnOpenDashboard.addEventListener("click", openFullDashboard);

  btnExportCsvPopup.addEventListener("click", function() {
    if (trackedJobs.length === 0) {
      showStatus("No tracked jobs to export.", "error");
      return;
    }
    var headers = ["Job Title", "Company", "City", "Location", "Status", "Match Score", "Date Added", "Notes", "URL"];
    var rows = [headers];

    trackedJobs.forEach(function(job) {
      rows.push([
        '"' + (job.title || "").replace(/"/g, '""') + '"',
        '"' + (job.company || "").replace(/"/g, '""') + '"',
        '"' + (job.city || "").replace(/"/g, '""') + '"',
        '"' + (job.location || "").replace(/"/g, '""') + '"',
        '"' + (job.status || "Saved") + '"',
        '"' + (job.matchScore || 0) + '%"',
        '"' + (job.dateAdded || "") + '"',
        '"' + (job.notes || "").replace(/"/g, '""') + '"',
        '"' + (job.url || "").replace(/"/g, '""') + '"'
      ]);
    });

    var csvContent = "data:text/csv;charset=utf-8," + rows.map(function(e) { return e.join(","); }).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "linkedin_job_applications_" + new Date().toISOString().slice(0, 10) + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showStatus("Exported " + trackedJobs.length + " jobs to CSV!", "success");
  });
}

// ── Initialization ────────────────────────────────────────────

function init() {
  setupTabs();
  setupAiSubtabs();
  setupAiActions();
  setupCopyButtons();
  renderSuggestChips();
  setupProfileActions();
  setupTrackerActions();

  loadUserProfile(function() {
    loadTrackedJobs(function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var tab = tabs[0];
        if (tab && tab.url) currentTabUrl = tab.url;

        if (!tab || !isLinkedInJobPage(tab.url)) {
          chrome.storage.local.get("lastExtractedJob", function(res) {
            if (res && res.lastExtractedJob && (res.lastExtractedJob.title || res.lastExtractedJob.company)) {
              showJobData(res.lastExtractedJob);
              showStatus("Showing last saved job. Open LinkedIn to scan a new one.", "info");
            } else {
              showEmptyState();
              showStatus("Open a LinkedIn job posting to use this extension.", "info");
            }
          });
          return;
        }

        btnExtract.disabled = false;
        extractJob(tab);
      });
    });
  });
}

// ── Button Listener ───────────────────────────────────────────

btnExtract.addEventListener("click", function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs[0]) {
      extractJob(tabs[0]);
    }
  });
});

init();
