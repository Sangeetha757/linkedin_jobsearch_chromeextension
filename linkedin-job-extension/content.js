/**
 * content.js — Phase 2: Full Job Description & Skill Extraction
 *
 * Capabilities:
 *  1. Extracts Job Title, Company, City, and Location (Phase 1)
 *  2. Extracts Full "About the job" Description (Phase 2)
 *  3. Detects and categorizes 100+ technical skills, frameworks, cloud, and tools (Phase 2)
 *  4. Works on both two-pane search/collections and full-page views
 */

(function() {
  // ── Selectors Config ──────────────────────────────────────────
  var SELECTORS = {
    roots: [
      ".scaffold-layout__detail",
      "[data-view-name='job-details']",
      ".jobs-search__job-details--wrapper",
      ".jobs-search-two-pane__detail-view",
      ".jobs-search__job-details",
      ".job-details-jobs-unified-top-card__container--two-pane",
      ".job-details-jobs-unified-top-card__container",
      ".jobs-unified-top-card",
      ".job-view-layout",
      "main",
      "body"
    ],

    title: [
      "h1.job-details-jobs-unified-top-card__job-title",
      "h2.job-details-jobs-unified-top-card__job-title",
      ".job-details-jobs-unified-top-card__job-title h1",
      ".job-details-jobs-unified-top-card__job-title h2",
      ".job-details-jobs-unified-top-card__job-title a",
      ".job-details-jobs-unified-top-card__job-title",
      "h1.jobs-unified-top-card__job-title",
      "h2.jobs-unified-top-card__job-title",
      ".jobs-unified-top-card__job-title h1",
      ".jobs-unified-top-card__job-title h2",
      ".jobs-unified-top-card__job-title a",
      ".jobs-unified-top-card__job-title",
      ".top-card-layout__title",
      ".topcard__title",
      ".scaffold-layout__detail h1",
      ".scaffold-layout__detail h2",
      ".jobs-search__job-details h1",
      ".jobs-search__job-details h2",
      "[data-view-name='job-details'] h1",
      "[data-view-name='job-details'] h2",
      "h1.t-24",
      "h2.t-24",
      "h1.t-bold",
      "h2.t-bold",
      "[class*='job-title']",
      "a[href*='/jobs/view/']",
      "h1",
      "h2"
    ],

    company: [
      ".job-details-jobs-unified-top-card__company-name a",
      ".job-details-jobs-unified-top-card__company-name",
      ".jobs-unified-top-card__company-name a",
      ".jobs-unified-top-card__company-name",
      ".topcard__org-name-link",
      ".top-card-layout__first-subline a",
      ".job-details-jobs-unified-top-card__primary-description-container a",
      ".job-details-jobs-unified-top-card__primary-description a",
      ".jobs-unified-top-card__primary-description a",
      ".jobs-unified-top-card__subtitle-primary-grouping a",
      ".artdeco-entity-lockup__subtitle a",
      ".artdeco-entity-lockup__subtitle span",
      ".artdeco-entity-lockup__subtitle",
      "a[href*='/company/']"
    ],

    location: [
      ".job-details-jobs-unified-top-card__primary-description-container",
      ".job-details-jobs-unified-top-card__primary-description",
      ".job-details-jobs-unified-top-card__tertiary-description",
      ".jobs-unified-top-card__primary-description",
      ".jobs-unified-top-card__tertiary-description",
      ".top-card-layout__first-subline",
      ".job-details-jobs-unified-top-card__bullet",
      ".jobs-unified-top-card__bullet",
      ".job-details-jobs-unified-top-card .t-14.t-black--light",
      ".job-details-jobs-unified-top-card .t-14",
      ".jobs-unified-top-card .t-14.t-black--light",
      ".jobs-unified-top-card .t-14",
      "span.tvm__text"
    ],

    description: [
      "#job-details",
      ".jobs-description__content",
      ".jobs-box__html-content",
      ".jobs-description-content__text",
      ".show-more-less-html__markup",
      "article.jobs-description__container",
      "[data-view-name='job-details'] #job-details",
      ".jobs-description"
    ],

    activeListCard: {
      container: [
        ".jobs-search-results-list__list-item--active",
        ".jobs-search-results__list-item--active",
        ".job-card-container--active",
        "li.selected",
        "[data-occludable-job-id].active"
      ],
      title: [
        ".job-card-list__title--link",
        ".job-card-container__link",
        "a[class*='job-card-list__title']"
      ],
      company: [
        ".artdeco-entity-lockup__subtitle",
        ".job-card-container__primary-description"
      ],
      location: [
        ".artdeco-entity-lockup__caption",
        ".job-card-container__metadata-item",
        "ul.job-card-container__metadata-wrapper li"
      ]
    }
  };

  // ── Skills Taxonomy & Extraction Engine ─────────────────────────
  var SKILLS_TAXONOMY = [
    // Programming Languages
    { name: "Python", category: "Languages", regex: /\bpython\b/i },
    { name: "JavaScript", category: "Languages", regex: /\bjavascript\b|\bjs\b/i },
    { name: "TypeScript", category: "Languages", regex: /\btypescript\b|\bts\b/i },
    { name: "Java", category: "Languages", regex: /\bjava\b(?!\s*script)/i },
    { name: "C++", category: "Languages", regex: /\bc\+\+\b/i },
    { name: "C#", category: "Languages", regex: /\bc#\b|\bc\s*sharp\b/i },
    { name: "C", category: "Languages", regex: /\bc\s+(programming|language)|\b(ansi\s+)?c\s*[\/,]\s*c\+\+/i },
    { name: "Golang", category: "Languages", regex: /\bgolang\b|\bgo\s+(programming|language)|\bgo\s*\/\s*golang\b/i },
    { name: "Rust", category: "Languages", regex: /\brust\b(?!\s+(oxide|corrosion))/i },
    { name: "Ruby", category: "Languages", regex: /\bruby\b/i },
    { name: "PHP", category: "Languages", regex: /\bphp\b/i },
    { name: "Swift", category: "Languages", regex: /\bswift\b/i },
    { name: "Kotlin", category: "Languages", regex: /\bkotlin\b/i },
    { name: "Scala", category: "Languages", regex: /\bscala\b/i },
    { name: "R", category: "Languages", regex: /\br\s+(programming|language|studio)|\br\/(python|sas)\b/i },
    { name: "Dart", category: "Languages", regex: /\bdart\b/i },
    { name: "SQL", category: "Languages", regex: /\bsql\b/i },
    { name: "Bash / Shell", category: "Languages", regex: /\b(bash|shell\s+scripting|powershell)\b/i },

    // Frontend & Mobile
    { name: "React", category: "Frontend & Mobile", regex: /\breact(\.js|js)?\b/i },
    { name: "React Native", category: "Frontend & Mobile", regex: /\breact[\s-]native\b/i },
    { name: "Angular", category: "Frontend & Mobile", regex: /\bangular(\.js|js)?\b/i },
    { name: "Vue.js", category: "Frontend & Mobile", regex: /\bvue(\.js|js)?\b/i },
    { name: "Next.js", category: "Frontend & Mobile", regex: /\bnext(\.js|js)?\b/i },
    { name: "HTML / HTML5", category: "Frontend & Mobile", regex: /\bhtml5?\b/i },
    { name: "CSS / CSS3", category: "Frontend & Mobile", regex: /\bcss3?\b/i },
    { name: "Tailwind CSS", category: "Frontend & Mobile", regex: /\btailwind(\s*css)?\b/i },
    { name: "Bootstrap", category: "Frontend & Mobile", regex: /\bbootstrap\b/i },
    { name: "Redux", category: "Frontend & Mobile", regex: /\bredux\b/i },
    { name: "Flutter", category: "Frontend & Mobile", regex: /\bflutter\b/i },
    { name: "Android", category: "Frontend & Mobile", regex: /\bandroid\b/i },
    { name: "iOS", category: "Frontend & Mobile", regex: /\bios\b/i },

    // Backend & APIs
    { name: "Node.js", category: "Backend & APIs", regex: /\bnode(\.js|js)?\b/i },
    { name: "Express.js", category: "Backend & APIs", regex: /\bexpress(\.js|js)?\b/i },
    { name: "NestJS", category: "Backend & APIs", regex: /\bnest(\.js|js)?\b/i },
    { name: "Django", category: "Backend & APIs", regex: /\bdjango\b/i },
    { name: "Flask", category: "Backend & APIs", regex: /\bflask\b/i },
    { name: "FastAPI", category: "Backend & APIs", regex: /\bfastapi\b/i },
    { name: "Spring Boot", category: "Backend & APIs", regex: /\bspring(\s*boot)?\b/i },
    { name: ".NET / ASP.NET", category: "Backend & APIs", regex: /\b(\.net|dotnet|asp\.net)\b/i },
    { name: "Ruby on Rails", category: "Backend & APIs", regex: /\b(ruby\s+on\s+rails|rails)\b/i },
    { name: "GraphQL", category: "Backend & APIs", regex: /\bgraphql\b/i },
    { name: "REST APIs", category: "Backend & APIs", regex: /\b(restful|rest)\s*(api|apis|services)?\b/i },
    { name: "Microservices", category: "Backend & APIs", regex: /\bmicroservices?\b/i },
    { name: "Kafka", category: "Backend & APIs", regex: /\b(apache\s+)?kafka\b/i },
    { name: "RabbitMQ", category: "Backend & APIs", regex: /\brabbitmq\b/i },
    { name: "gRPC", category: "Backend & APIs", regex: /\bgrpc\b/i },

    // Cloud & DevOps
    { name: "AWS", category: "Cloud & DevOps", regex: /\b(aws|amazon\s+web\s+services)\b/i },
    { name: "Azure", category: "Cloud & DevOps", regex: /\b(azure|microsoft\s+azure)\b/i },
    { name: "GCP", category: "Cloud & DevOps", regex: /\b(gcp|google\s+cloud(\s+platform)?)\b/i },
    { name: "Docker", category: "Cloud & DevOps", regex: /\bdocker\b/i },
    { name: "Kubernetes", category: "Cloud & DevOps", regex: /\b(kubernetes|k8s)\b/i },
    { name: "CI/CD", category: "Cloud & DevOps", regex: /\bci[\/\s-]cd\b|continuous\s+integration/i },
    { name: "Terraform", category: "Cloud & DevOps", regex: /\bterraform\b/i },
    { name: "Ansible", category: "Cloud & DevOps", regex: /\bansible\b/i },
    { name: "Jenkins", category: "Cloud & DevOps", regex: /\bjenkins\b/i },
    { name: "GitHub Actions", category: "Cloud & DevOps", regex: /\bgithub\s+actions\b/i },
    { name: "Linux", category: "Cloud & DevOps", regex: /\blinux\b|\bunix\b/i },

    // Databases & Storage
    { name: "PostgreSQL", category: "Databases", regex: /\b(postgres|postgresql)\b/i },
    { name: "MySQL", category: "Databases", regex: /\bmysql\b/i },
    { name: "MongoDB", category: "Databases", regex: /\bmongo(db)?\b/i },
    { name: "Redis", category: "Databases", regex: /\bredis\b/i },
    { name: "Elasticsearch", category: "Databases", regex: /\belasticsearch\b|\belk\b/i },
    { name: "DynamoDB", category: "Databases", regex: /\bdynamodb\b/i },
    { name: "Oracle DB", category: "Databases", regex: /\boracle\s*(db|database)?\b/i },
    { name: "Cassandra", category: "Databases", regex: /\bcassandra\b/i },
    { name: "Snowflake", category: "Databases", regex: /\bsnowflake\b/i },
    { name: "Firebase", category: "Databases", regex: /\bfirebase\b/i },

    // AI, Data & Machine Learning
    { name: "Machine Learning", category: "AI & Data", regex: /\bmachine\s+learning|\bml\b/i },
    { name: "Deep Learning", category: "AI & Data", regex: /\bdeep\s+learning|\bdl\b/i },
    { name: "PyTorch", category: "AI & Data", regex: /\bpytorch\b/i },
    { name: "TensorFlow", category: "AI & Data", regex: /\btensorflow\b/i },
    { name: "Scikit-Learn", category: "AI & Data", regex: /\bscikit[\s-]learn\b|\bsklearn\b/i },
    { name: "Pandas", category: "AI & Data", regex: /\bpandas\b/i },
    { name: "NumPy", category: "AI & Data", regex: /\bnumpy\b/i },
    { name: "NLP", category: "AI & Data", regex: /\bnatural\s+language\s+processing|\bnlp\b/i },
    { name: "LLMs / Generative AI", category: "AI & Data", regex: /\b(llms?|large\s+language\s+models?|generative\s+ai|genai|langchain)\b/i },
    { name: "Spark", category: "AI & Data", regex: /\b(apache\s+)?spark\b/i },

    // Tools & Architecture
    { name: "Git", category: "Tools & Testing", regex: /\bgit\b(?!\s*(hub|lab))/i },
    { name: "GitHub / GitLab", category: "Tools & Testing", regex: /\b(github|gitlab)\b/i },
    { name: "Jira", category: "Tools & Testing", regex: /\bjira\b/i },
    { name: "Agile / Scrum", category: "Tools & Testing", regex: /\b(agile|scrum)\b/i },
    { name: "Unit Testing", category: "Tools & Testing", regex: /\bunit\s+test(ing|s)?\b|\b(jest|pytest|mocha|cypress|selenium)\b/i },
    { name: "System Design", category: "Tools & Testing", regex: /\bsystem\s+design\b|\bsoftware\s+architecture\b/i }
  ];

  function extractSkillsFromText(text) {
    if (!text) return { all: [], byCategory: {} };

    var foundMap = {};
    var byCategory = {};

    for (var i = 0; i < SKILLS_TAXONOMY.length; i++) {
      var item = SKILLS_TAXONOMY[i];
      if (item.regex.test(text)) {
        if (!foundMap[item.name]) {
          foundMap[item.name] = true;
          if (!byCategory[item.category]) {
            byCategory[item.category] = [];
          }
          byCategory[item.category].push(item.name);
        }
      }
    }

    var allList = Object.keys(foundMap);
    return {
      all: allList,
      totalCount: allList.length,
      byCategory: byCategory
    };
  }

  // ── Utility ───────────────────────────────────────────────────

  function findVisibleElement(selectors, root, validator) {
    root = root || document;
    for (var i = 0; i < selectors.length; i++) {
      try {
        var els = root.querySelectorAll(selectors[i]);
        for (var j = 0; j < els.length; j++) {
          var el = els[j];
          if (el.offsetWidth === 0 && el.offsetHeight === 0 && el.offsetParent === null) {
            continue;
          }
          var text = (el.innerText || el.textContent || "").trim();
          if (!text) continue;
          if (validator && !validator(text, el)) continue;
          return { text: text, el: el };
        }
      } catch (e) { /* skip */ }
    }
    return { text: "", el: null };
  }

  function isNoiseOrBadge(text) {
    if (!text) return true;
    var s = text.trim();
    if (s.length === 0 || s.length > 80) return true;

    var lower = s.toLowerCase();

    if (/preferences|search results|jobs based on|jobs you might|about the job|job details|qualifications|summary/i.test(lower)) {
      return true;
    }
    if (/^(easy apply|apply|save|saved|follow|following|repost|viewed|promoted|share|send|more)$/i.test(lower)) {
      return true;
    }
    if (/^((reposted\s*)?\d+\s*(second|minute|hour|day|week|month|year)s?\s*ago|just now)$/i.test(lower)) {
      return true;
    }
    if (/^(over\s*)?\d+\s*(people|applicants?)(\s*clicked\s*apply)?|be an early applicant|actively recruiting/i.test(lower)) {
      return true;
    }
    if (/response insight|no response insight|responses managed|seen by/i.test(lower)) {
      return true;
    }
    if (/^(remote|on-site|hybrid|full-time|part-time|contract|temporary|internship|other)$/i.test(lower)) {
      return true;
    }
    if (/match your profile|match some required|qualifications|missing some/i.test(lower)) {
      return true;
    }

    return false;
  }

  function parseLocationAndCity(raw) {
    if (!raw) return { city: "", location: "" };

    var parts = raw.split(/[·•|\n\r]/);
    var primary = parts[0].trim();
    var cleanedLocation = primary.replace(/\s*\((remote|on-site|hybrid|full.time|part.time|contract)\)/gi, "").trim();
    var segments = cleanedLocation.split(",");
    var city = segments[0] ? segments[0].trim() : cleanedLocation;

    return {
      city: city || cleanedLocation,
      location: cleanedLocation || primary
    };
  }

  function getJobRoot() {
    for (var i = 0; i < SELECTORS.roots.length; i++) {
      var el = document.querySelector(SELECTORS.roots[i]);
      if (el) return el;
    }
    return document;
  }

  // ── Extractors ────────────────────────────────────────────────

  function extractTitle(root, company) {
    root = root || getJobRoot();

    function isValidTitle(text) {
      if (!text || text.length < 2 || text.length > 120) return false;
      var lower = text.toLowerCase();
      if (/^(linkedin|search|jobs|home|messaging|notifications|feed|preferences|close|dismiss)$/i.test(lower)) return false;
      if (/^(jobs based on your preferences|jobs you might be interested in|search results)$/i.test(lower)) return false;
      if (company && lower === company.toLowerCase()) return false;
      return true;
    }

    return findVisibleElement(SELECTORS.title, root, isValidTitle);
  }

  function extractCompany(root) {
    root = root || getJobRoot();

    function isValidCompany(text) {
      if (!text || text.length < 2 || text.length > 100) return false;
      var lower = text.toLowerCase();
      if (/^(linkedin|easy apply|apply|save|saved|follow|following|repost|viewed|promoted|share|send|more)$/i.test(lower)) return false;
      if (/preferences|search results|jobs based on/i.test(lower)) return false;
      return true;
    }

    return findVisibleElement(SELECTORS.company, root, isValidCompany);
  }

  function extractLocation(root, title, company, titleEl, companyEl) {
    var scope = null;
    if (titleEl) {
      scope = titleEl.closest(
        ".job-details-jobs-unified-top-card, .jobs-unified-top-card, [data-view-name='job-details'], .scaffold-layout__detail, .jobs-search__job-details, .job-view-layout, .artdeco-card"
      ) || titleEl.parentElement;
    } else if (companyEl) {
      scope = companyEl.closest(
        ".job-details-jobs-unified-top-card, .jobs-unified-top-card, [data-view-name='job-details'], .scaffold-layout__detail, .jobs-search__job-details, .job-view-layout, .artdeco-card"
      ) || companyEl.parentElement;
    }

    if (!scope) {
      scope = root.querySelector(
        ".scaffold-layout__detail, [data-view-name='job-details'], .jobs-search__job-details, .job-details-jobs-unified-top-card, .jobs-unified-top-card"
      ) || root;
    }

    // 1. Check elements directly following titleEl
    if (titleEl && titleEl.parentElement) {
      var nextEl = titleEl.nextElementSibling || (titleEl.parentElement.nextElementSibling);
      if (nextEl) {
        var nextText = (nextEl.innerText || nextEl.textContent || "").trim();
        if (nextText) {
          var lines = nextText.split(/[·•|\n\r]+/);
          for (var i = 0; i < lines.length; i++) {
            var seg = lines[i].trim();
            if (seg && !isNoiseOrBadge(seg) && seg !== company && seg !== title) {
              return parseLocationAndCity(seg);
            }
          }
        }
      }
    }

    // 2. Scan candidate location containers in the scoped card
    for (var s = 0; s < SELECTORS.location.length; s++) {
      var els = scope.querySelectorAll(SELECTORS.location[s]);
      for (var j = 0; j < els.length; j++) {
        var raw = (els[j].innerText || els[j].textContent || "").trim();
        if (!raw) continue;

        var segments = raw.split(/[·•|\n\r]+/);
        for (var k = 0; k < segments.length; k++) {
          var candidate = segments[k].trim();
          if (!candidate) continue;
          if (company && candidate.toLowerCase() === company.toLowerCase()) continue;
          if (title && candidate.toLowerCase() === title.toLowerCase()) continue;
          if (isNoiseOrBadge(candidate)) continue;

          return parseLocationAndCity(candidate);
        }
      }
    }

    // 3. Scan all paragraphs and spans strictly inside scoped card
    var allSpans = scope.querySelectorAll("p, span, div");
    for (var m = 0; m < allSpans.length; m++) {
      var t = (allSpans[m].innerText || allSpans[m].textContent || "").trim();
      if (!t) continue;
      if (company && t.toLowerCase() === company.toLowerCase()) continue;
      if (title && t.toLowerCase() === title.toLowerCase()) continue;

      if (t.indexOf("·") !== -1 || t.indexOf(",") !== -1) {
        var parts = t.split(/[·•|\n\r]+/);
        for (var p = 0; p < parts.length; p++) {
          var cleanPart = parts[p].trim();
          if (cleanPart && !isNoiseOrBadge(cleanPart) && cleanPart !== company && cleanPart !== title) {
            return parseLocationAndCity(cleanPart);
          }
        }
      }
    }

    // 4. Fallback: Search the active list card in the left pane
    var leftCard = document.querySelector(
      ".jobs-search-results-list__list-item--active, " +
      ".jobs-search-results__list-item--active, " +
      ".job-card-container--active, " +
      "[data-occludable-job-id].active, " +
      "li.selected"
    );
    if (leftCard) {
      for (var l = 0; l < SELECTORS.activeListCard.location.length; l++) {
        var leftEl = leftCard.querySelector(SELECTORS.activeListCard.location[l]);
        if (leftEl) {
          var leftText = (leftEl.innerText || leftEl.textContent || "").trim();
          if (leftText && !isNoiseOrBadge(leftText)) {
            return parseLocationAndCity(leftText);
          }
        }
      }
    }

    return { city: "", location: "" };
  }

  /**
   * Phase 2: Extract full job description text from 'About the job'
   */
  function extractDescription(root) {
    root = root || getJobRoot();

    // 1. Primary Strategy: Locate the explicit "About the job" section heading
    var allHeadings = document.querySelectorAll("h2, h3, h4, h1, span, strong, div");
    for (var h = 0; h < allHeadings.length; h++) {
      var hText = (allHeadings[h].innerText || allHeadings[h].textContent || "").trim();
      if (/^about the job$/i.test(hText)) {
        var headingEl = allHeadings[h];

        // Find enclosing card or section
        var container = headingEl.closest("section, article, .artdeco-card, [class*='description'], div");
        if (container) {
          // If there's an expandable "Show more" button, click it to reveal full text
          var moreBtn = container.querySelector(
            "button[aria-label*='more'], button.jobs-description__footer-button, button.show-more-less-html__button, button.show-more-less-button"
          );
          if (moreBtn && typeof moreBtn.click === "function") {
            try { moreBtn.click(); } catch (e) { /* ignore */ }
          }

          var text = (container.innerText || container.textContent || "").trim();
          // Remove the "About the job" heading itself from the beginning of the text
          text = text.replace(/^about the job\s*/i, "").trim();

          if (text && text.length > 40) {
            console.log("[Job Search Assistant] Extracted description via 'About the job' heading:", text.length, "chars");
            return text;
          }
        }

        // Try next element sibling if container wasn't sufficient
        var nextSib = headingEl.nextElementSibling;
        if (nextSib) {
          var sibText = (nextSib.innerText || nextSib.textContent || "").trim();
          if (sibText && sibText.length > 40) {
            return sibText;
          }
        }
      }
    }

    // 2. Secondary Strategy: Standard LinkedIn description classes
    var descSelectors = [
      "#job-details",
      ".jobs-description__content",
      ".jobs-box__html-content",
      ".jobs-description-content__text",
      ".show-more-less-html__markup",
      "article.jobs-description__container",
      "[data-view-name='job-details'] #job-details",
      "[data-view-name='job-details'] [class*='description']",
      ".jobs-description",
      ".jobs-details__main-content",
      "[class*='jobs-description']",
      "[class*='description__content']",
      "[class*='description__text']"
    ];

    for (var i = 0; i < descSelectors.length; i++) {
      var els = (root || document).querySelectorAll(descSelectors[i]);
      for (var j = 0; j < els.length; j++) {
        var elText = (els[j].innerText || els[j].textContent || "").trim();
        if (elText && elText.length > 60) {
          console.log("[Job Search Assistant] Extracted description via selector:", descSelectors[i]);
          return elText;
        }
      }
    }

    return "";
  }

  function extractFromActiveListCard() {
    var activeContainer = null;
    for (var i = 0; i < SELECTORS.activeListCard.container.length; i++) {
      activeContainer = document.querySelector(SELECTORS.activeListCard.container[i]);
      if (activeContainer) break;
    }

    if (!activeContainer) {
      return { title: "", company: "", location: "" };
    }

    var titleObj = findVisibleElement(SELECTORS.activeListCard.title, activeContainer);
    var compObj = findVisibleElement(SELECTORS.activeListCard.company, activeContainer);
    var locObj = findVisibleElement(SELECTORS.activeListCard.location, activeContainer);

    return { title: titleObj.text, company: compObj.text, location: locObj.text };
  }

  // ── Main Export ───────────────────────────────────────────────

  function extractJobData() {
    var root = getJobRoot();
    var compObj = extractCompany(root);
    var titleObj = extractTitle(root, compObj.text);
    var locObj = extractLocation(root, titleObj.text, compObj.text, titleObj.el, compObj.el);
    var description = extractDescription(root);

    var title = titleObj.text;
    var company = compObj.text;

    // Fallbacks from active list card
    if (!title || !locObj.location) {
      var fallback = extractFromActiveListCard();
      if (!title && fallback.title) title = fallback.title;
      if (!company && fallback.company) company = fallback.company;
      if (!locObj.location && fallback.location) {
        locObj = parseLocationAndCity(fallback.location);
      }
    }

    // Phase 2: Skill extraction
    var skillData = extractSkillsFromText(description + " " + title);

    var result = {
      title: title,
      company: company,
      city: locObj.city,
      location: locObj.location,
      description: description,
      skills: skillData
    };

    console.log("[Job Search Assistant] Extracted Phase 2 Data:", result);
    return result;
  }

  // Attach to window for executeScript
  window.extractJobData = extractJobData;
  console.log("[Job Search Assistant] Phase 2 content.js active on:", window.location.href);
})();
