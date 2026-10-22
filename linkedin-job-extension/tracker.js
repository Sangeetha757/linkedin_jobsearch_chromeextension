/**
 * tracker.js — Full Application Dashboard & Analytics
 *
 * Capabilities:
 *  - Real-time application metrics (Total, Applied, Interviewing, Offers, Avg Score)
 *  - Status filtering (All, Saved, Applied, Interviewing, Offer, Rejected)
 *  - Search by title, company, location, or notes
 *  - Inline status update & notes editing
 *  - 1-Click CSV Data Export
 */

var trackedJobs = [];
var currentFilter = "all";
var searchQuery = "";

// DOM Elements
var metricTotal       = document.getElementById("metric-total");
var metricApplied     = document.getElementById("metric-applied");
var metricInterview   = document.getElementById("metric-interview");
var metricOffers      = document.getElementById("metric-offers");
var metricAvgScore    = document.getElementById("metric-avg-score");

var countAll          = document.getElementById("count-all");
var countSaved        = document.getElementById("count-saved");
var countApplied      = document.getElementById("count-applied");
var countInterviewing = document.getElementById("count-interviewing");
var countOffer        = document.getElementById("count-offer");
var countRejected     = document.getElementById("count-rejected");

var inputSearch       = document.getElementById("input-search");
var filterPills       = document.querySelectorAll(".filter-pill");
var jobsGrid          = document.getElementById("jobs-grid");
var emptyState        = document.getElementById("empty-state");

var btnExportCsv      = document.getElementById("btn-export-csv");
var btnRefresh        = document.getElementById("btn-refresh-dashboard");

// ── Data Loading & Persistence ────────────────────────────────

function loadTrackedJobs() {
  chrome.storage.local.get("trackedJobs", function(result) {
    trackedJobs = (result && Array.isArray(result.trackedJobs)) ? result.trackedJobs : [];
    updateMetrics();
    renderJobs();
  });
}

function saveTrackedJobs() {
  chrome.storage.local.set({ trackedJobs: trackedJobs }, function() {
    updateMetrics();
    renderJobs();
  });
}

// ── Metrics Calculation ───────────────────────────────────────

function updateMetrics() {
  var total = trackedJobs.length;
  var applied = 0;
  var interview = 0;
  var offers = 0;
  var saved = 0;
  var rejected = 0;
  var totalScore = 0;
  var scoredCount = 0;

  trackedJobs.forEach(function(job) {
    var status = (job.status || "Saved").toLowerCase();
    if (status === "applied") applied++;
    else if (status === "interviewing") interview++;
    else if (status === "offer") offers++;
    else if (status === "rejected") rejected++;
    else saved++;

    if (typeof job.matchScore === "number" && job.matchScore > 0) {
      totalScore += job.matchScore;
      scoredCount++;
    }
  });

  metricTotal.textContent     = total;
  metricApplied.textContent   = applied;
  metricInterview.textContent = interview;
  metricOffers.textContent    = offers;

  var avg = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;
  metricAvgScore.textContent  = avg + "%";

  countAll.textContent          = total;
  countSaved.textContent        = saved;
  countApplied.textContent      = applied;
  countInterviewing.textContent = interview;
  countOffer.textContent        = offers;
  countRejected.textContent     = rejected;
}

// ── Render Jobs Grid ──────────────────────────────────────────

function renderJobs() {
  jobsGrid.innerHTML = "";

  var filtered = trackedJobs.filter(function(job) {
    // 1. Status Filter
    if (currentFilter !== "all") {
      if ((job.status || "Saved").toLowerCase() !== currentFilter.toLowerCase()) {
        return false;
      }
    }

    // 2. Search Query Filter
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      var t = (job.title || "").toLowerCase();
      var c = (job.company || "").toLowerCase();
      var l = (job.location || job.city || "").toLowerCase();
      var n = (job.notes || "").toLowerCase();
      return t.indexOf(q) !== -1 || c.indexOf(q) !== -1 || l.indexOf(q) !== -1 || n.indexOf(q) !== -1;
    }

    return true;
  });

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtered.forEach(function(job, index) {
    var card = document.createElement("div");
    card.className = "job-card";

    // Score Tier
    var score = typeof job.matchScore === "number" ? job.matchScore : 0;
    var scoreClass = "low";
    if (score >= 70) scoreClass = "high";
    else if (score >= 40) scoreClass = "medium";

    // Top Row
    var topRow = document.createElement("div");
    topRow.className = "card-top";

    var titleBox = document.createElement("div");
    titleBox.className = "card-title-box";

    var jobTitle = document.createElement("h3");
    jobTitle.className = "card-job-title";
    jobTitle.textContent = job.title || "Untitled Role";

    var companyName = document.createElement("p");
    companyName.className = "card-company-name";
    companyName.textContent = job.company || "Unknown Company";

    var location = document.createElement("p");
    location.className = "card-location";
    location.textContent = job.location || job.city || "Location not specified";

    titleBox.appendChild(jobTitle);
    titleBox.appendChild(companyName);
    titleBox.appendChild(location);

    var scoreBadge = document.createElement("div");
    scoreBadge.className = "score-badge-circle " + scoreClass;
    scoreBadge.innerHTML = score + "%<span style='font-size:8px;font-weight:600;'>MATCH</span>";
    scoreBadge.title = "Skills Match Score: " + score + "%";

    topRow.appendChild(titleBox);
    topRow.appendChild(scoreBadge);
    card.appendChild(topRow);

    // Skills Preview Row
    var skillsList = (job.skills && job.skills.all) ? job.skills.all : (job.matchedSkills || []);
    if (skillsList.length > 0) {
      var skillsRow = document.createElement("div");
      skillsRow.className = "card-skills-row";
      var maxSkills = Math.min(skillsList.length, 4);
      for (var s = 0; s < maxSkills; s++) {
        var sPill = document.createElement("span");
        sPill.className = "card-skill-pill";
        sPill.textContent = skillsList[s];
        skillsRow.appendChild(sPill);
      }
      if (skillsList.length > 4) {
        var morePill = document.createElement("span");
        morePill.className = "card-skill-pill";
        morePill.style.color = "#64748b";
        morePill.textContent = "+" + (skillsList.length - 4);
        skillsRow.appendChild(morePill);
      }
      card.appendChild(skillsRow);
    }

    // Notes Input
    var notesInput = document.createElement("input");
    notesInput.type = "text";
    notesInput.className = "card-notes-input";
    notesInput.placeholder = "Add notes (recruiter, next steps, interview date)...";
    notesInput.value = job.notes || "";
    notesInput.addEventListener("change", function() {
      job.notes = notesInput.value.trim();
      saveTrackedJobs();
    });
    card.appendChild(notesInput);

    // Bottom Row: Status Select & Actions
    var bottomRow = document.createElement("div");
    bottomRow.className = "card-bottom";

    var statusSelect = document.createElement("select");
    var currentStatus = job.status || "Saved";
    statusSelect.className = "status-select status-" + currentStatus;

    var statuses = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];
    statuses.forEach(function(st) {
      var opt = document.createElement("option");
      opt.value = st;
      opt.textContent = st;
      if (st.toLowerCase() === currentStatus.toLowerCase()) {
        opt.selected = true;
      }
      statusSelect.appendChild(opt);
    });

    statusSelect.addEventListener("change", function() {
      job.status = statusSelect.value;
      statusSelect.className = "status-select status-" + job.status;
      saveTrackedJobs();
    });

    var actionsBox = document.createElement("div");
    actionsBox.className = "card-actions";

    if (job.url) {
      var linkBtn = document.createElement("a");
      linkBtn.href = job.url;
      linkBtn.target = "_blank";
      linkBtn.className = "icon-btn";
      linkBtn.title = "Open on LinkedIn";
      linkBtn.textContent = "↗";
      actionsBox.appendChild(linkBtn);
    }

    var deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn btn-delete";
    deleteBtn.title = "Delete this application";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", function() {
      if (confirm("Remove '" + (job.title || "this job") + "' from your tracker?")) {
        var realIndex = trackedJobs.indexOf(job);
        if (realIndex !== -1) {
          trackedJobs.splice(realIndex, 1);
          saveTrackedJobs();
        }
      }
    });
    actionsBox.appendChild(deleteBtn);

    bottomRow.appendChild(statusSelect);
    bottomRow.appendChild(actionsBox);
    card.appendChild(bottomRow);

    jobsGrid.appendChild(card);
  });
}

// ── Export CSV ────────────────────────────────────────────────

function exportToCsv() {
  if (trackedJobs.length === 0) {
    alert("No tracked jobs to export.");
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
}

// ── Event Listeners ───────────────────────────────────────────

function setupListeners() {
  filterPills.forEach(function(pill) {
    pill.addEventListener("click", function() {
      filterPills.forEach(function(p) { p.classList.remove("active"); });
      pill.classList.add("active");
      currentFilter = pill.getAttribute("data-filter");
      renderJobs();
    });
  });

  inputSearch.addEventListener("input", function() {
    searchQuery = inputSearch.value.trim();
    renderJobs();
  });

  btnExportCsv.addEventListener("click", exportToCsv);
  btnRefresh.addEventListener("click", loadTrackedJobs);
}

// ── Run ───────────────────────────────────────────────────────
setupListeners();
loadTrackedJobs();
