/*
  Kepora careers board - the widget that runs on www.kepora.com/job-listings.

  Wix loads this file; the page itself only holds a two-line loader:

      <div id="kepora-jobs-root"></div>
      <script src="<the hosted url of this file>"></script>

  So changing the board means updating this file, not editing Wix. The job list
  itself was always live: it is read from Ashby's public job board API on every
  page load, and shows whatever `kepora.py jobs sync` has published.

  Keep this file ASCII-only - a Wix embed gives no charset hint.
*/
(function () {
  var CSS = '  @import url(\'https://fonts.googleapis.com/css2?family=Raleway:wght@600;700&family=Open+Sans:wght@400;600&display=swap\');\n\n  #kepora-jobs {\n    --navy: #0c3c60;\n    --line: #e2e8ee;\n    --muted: #5a6b7a;\n    font-family: \'Open Sans\', Arial, Helvetica, sans-serif;\n    color: #1a1a1a;\n    max-width: 960px;\n    margin: 0 auto;\n    padding: 8px 16px 32px;\n    box-sizing: border-box;\n  }\n  #kepora-jobs *, #kepora-jobs *::before, #kepora-jobs *::after { box-sizing: inherit; }\n\n  .kj-head h2 {\n    font-family: \'Raleway\', sans-serif;\n    font-size: 26px; font-weight: 700; color: var(--navy);\n    margin: 0 0 4px;\n  }\n  .kj-count { margin: 0 0 16px; color: var(--muted); font-size: 14px; }\n\n  .kj-clearance {\n    background: #f2f6f9; border-left: 4px solid var(--navy);\n    padding: 10px 14px; margin: 0 0 18px; font-size: 14px; line-height: 1.5;\n  }\n\n  .kj-controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 14px; }\n  #kj-search {\n    flex: 1 1 260px; min-width: 0;\n    padding: 10px 12px; font: inherit; font-size: 15px;\n    border: 1px solid var(--line); border-radius: 6px; background: #fff;\n  }\n  #kj-search:focus { outline: 2px solid var(--navy); outline-offset: -1px; }\n\n  .kj-filters { display: flex; flex-wrap: wrap; gap: 6px; }\n  .kj-chip {\n    font: inherit; font-size: 13px; cursor: pointer;\n    padding: 7px 12px; border-radius: 999px;\n    border: 1px solid var(--line); background: #fff; color: var(--muted);\n  }\n  .kj-chip:hover { border-color: var(--navy); color: var(--navy); }\n  .kj-chip[aria-pressed="true"] { background: var(--navy); border-color: var(--navy); color: #fff; }\n\n  .kj-list { border-top: 1px solid var(--line); }\n  .kj-row {\n    width: 100%; display: flex; align-items: center; gap: 12px; text-align: left;\n    padding: 16px 4px; background: none; border: 0; border-bottom: 1px solid var(--line);\n    font: inherit; cursor: pointer;\n  }\n  .kj-row:hover { background: #f7fafc; }\n  .kj-row:focus-visible { outline: 2px solid var(--navy); outline-offset: -2px; }\n  .kj-title { font-weight: 600; color: var(--navy); font-size: 16px; }\n  .kj-meta { color: var(--muted); font-size: 13px; margin-top: 2px; }\n  .kj-summary { color: var(--muted); font-size: 13px; font-style: italic; margin-top: 3px; display: block; }\n  .kj-grow { flex: 1; min-width: 0; }\n  .kj-caret { color: var(--muted); font-size: 12px; transition: transform .15s ease; }\n  .kj-row[aria-expanded="true"] .kj-caret { transform: rotate(90deg); }\n\n  .kj-detail { display: none; padding: 4px 4px 24px; border-bottom: 1px solid var(--line); }\n  .kj-detail.kj-open { display: block; }\n  .kj-detail-body { font-size: 15px; line-height: 1.6; color: #2b2b2b; }\n  .kj-detail-body p { margin: 0 0 12px; }\n  .kj-detail-body ul { margin: 0 0 12px 20px; padding: 0; }\n  .kj-detail-body li { margin-bottom: 6px; }\n  .kj-detail-body hr { border: 0; border-top: 1px solid var(--line); margin: 16px 0; }\n\n  .kj-apply {\n    display: inline-block; margin-top: 8px;\n    background: var(--navy); color: #fff; text-decoration: none;\n    font-weight: 600; font-size: 15px; padding: 11px 26px; border-radius: 4px;\n  }\n  .kj-apply:hover { background: #09304d; }\n\n  .kj-empty { padding: 28px 4px; color: var(--muted); font-size: 15px; }\n  .kj-empty a { color: var(--navy); }\n\n  @media (max-width: 560px) {\n    .kj-controls { flex-direction: column; align-items: stretch; }\n    .kj-title { font-size: 15px; }\n  }';

  var SHELL = '<div id="kepora-jobs">\n  <div class="kj-head">\n    <h2>Open Positions</h2>\n    <p class="kj-count" id="kj-count">Loading roles...</p>\n  </div>\n\n  <p class="kj-clearance">\n    <span aria-hidden="true">&#128274;</span>\n    Every position requires U.S. citizenship and an active\n    <strong>TS/SCI clearance with a Full Scope Polygraph</strong>.\n  </p>\n\n  <div class="kj-controls">\n    <input id="kj-search" type="search" placeholder="Search roles, for example: data scientist"\n           aria-label="Search open positions" autocomplete="off">\n    <div id="kj-filters" class="kj-filters" role="group" aria-label="Filter by location"></div>\n  </div>\n\n  <div id="kj-list" class="kj-list" aria-live="polite"></div>\n</div>';

  var script = document.currentScript;
  var mount = document.getElementById("kepora-jobs-root");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "kepora-jobs-root";
    if (script && script.parentNode) script.parentNode.insertBefore(mount, script);
    else document.body.appendChild(mount);
  }
  var styles = document.createElement("style");
  styles.textContent = CSS;
  document.head.appendChild(styles);
  mount.innerHTML = SHELL;

  var BOARD = "https://api.ashbyhq.com/posting-api/job-board/kepora";
  var FALLBACK = "https://jobs.ashbyhq.com/kepora";
  var listEl = document.getElementById("kj-list");
  var countEl = document.getElementById("kj-count");
  var searchEl = document.getElementById("kj-search");
  var filtersEl = document.getElementById("kj-filters");
  var jobs = [], location = "All", query = "";

  function text(el, value) { el.textContent = value; }

  function clean(html) {
    // Descriptions come from our own Ashby postings; strip scripts regardless.
    var box = document.createElement("div");
    box.innerHTML = html || "";
    box.querySelectorAll("script, style, iframe").forEach(function (n) { n.remove(); });
    return box.innerHTML;
  }

  // Several roles share a title and location but are different requisitions on
  // different task orders (one Application Engineer 4 is Angular, the next is
  // Python). Give only those rows a one-line summary, so they read as distinct
  // without cluttering the roles that are already unique.
  var HEADER_END = "will not be considered.";
  var LABELS = /^(description|introduction|required|requirements|overview)\b[:\s-]*/i;
  var MAX = 105;

  function bodyText(job) {
    var text = (job.descriptionPlain || "").replace(/\s+/g, " ").trim();
    var cut = text.indexOf(HEADER_END);
    return cut === -1 ? text : text.slice(cut + HEADER_END.length).trim();
  }

  function clip(text, from) {
    var out = from ? text.slice(from) : text.replace(LABELS, "").replace(LABELS, "");
    out = out.trim();
    if (out.length > MAX) {
      var space = out.slice(0, MAX).lastIndexOf(" ");
      out = (space > 60 ? out.slice(0, space) : out.slice(0, MAX)) + "\u2026";
    }
    return (from ? "\u2026" : "") + out;
  }

  function addSummaries(list) {
    var byKey = {};
    list.forEach(function (j) {
      var key = j.title + "|" + j.location;
      (byKey[key] = byKey[key] || []).push(j);
    });
    Object.keys(byKey).forEach(function (key) {
      var group = byKey[key];
      if (group.length < 2) { group[0].kjSummary = ""; return; }

      // Two postings for the same title often open with the same boilerplate.
      // Start the summary where they actually diverge, so the rows differ.
      var bodies = group.map(bodyText);
      var lead = 0;
      while (bodies.every(function (b) { return lead < b.length && b[lead] === bodies[0][lead]; })) lead++;
      if (lead > 40) {
        var back = bodies[0].lastIndexOf(" ", lead);
        lead = back > 0 ? back + 1 : lead;
      } else {
        lead = 0;
      }
      group.forEach(function (j, i) { j.kjSummary = clip(bodies[i], lead); });
    });
  }

  function matches(job) {
    if (location !== "All" && job.location !== location) return false;
    if (!query) return true;
    return (job.title + " " + job.location + " " + (job.descriptionPlain || ""))
      .toLowerCase().indexOf(query) !== -1;
  }

  function render() {
    var shown = jobs.filter(matches);
    listEl.innerHTML = "";

    if (!shown.length) {
      var empty = document.createElement("p");
      empty.className = "kj-empty";
      empty.textContent = jobs.length
        ? "No roles match that search. Try a different term or clear the filters."
        : "No openings are posted right now. Please check back soon.";
      listEl.appendChild(empty);
      text(countEl, jobs.length ? "0 of " + jobs.length + " roles" : "");
      return;
    }

    text(countEl, shown.length === jobs.length
      ? jobs.length + (jobs.length === 1 ? " open role" : " open roles")
      : shown.length + " of " + jobs.length + " roles");

    shown.forEach(function (job, i) {
      var row = document.createElement("button");
      row.type = "button";
      row.className = "kj-row";
      row.setAttribute("aria-expanded", "false");
      row.setAttribute("aria-controls", "kj-detail-" + i);

      var grow = document.createElement("span");
      grow.className = "kj-grow";
      var title = document.createElement("span");
      title.className = "kj-title";
      title.textContent = job.title;
      var meta = document.createElement("span");
      meta.className = "kj-meta";
      meta.textContent = [job.location, job.employmentType === "FullTime" ? "Full-time" : job.employmentType]
        .filter(Boolean).join("  \u00b7  ");
      grow.appendChild(title);
      grow.appendChild(document.createElement("br"));
      grow.appendChild(meta);
      if (job.kjSummary) {
        var summary = document.createElement("span");
        summary.className = "kj-summary";
        summary.textContent = job.kjSummary;
        grow.appendChild(summary);
      }

      var caret = document.createElement("span");
      caret.className = "kj-caret";
      caret.textContent = "\u25b6";

      row.appendChild(grow);
      row.appendChild(caret);

      var detail = document.createElement("div");
      detail.className = "kj-detail";
      detail.id = "kj-detail-" + i;
      var body = document.createElement("div");
      body.className = "kj-detail-body";
      body.innerHTML = clean(job.descriptionHtml);
      var apply = document.createElement("a");
      apply.className = "kj-apply";
      apply.href = job.applyUrl || job.jobUrl;
      apply.target = "_blank";
      apply.rel = "noopener";
      apply.textContent = "Apply for this role";
      detail.appendChild(body);
      detail.appendChild(apply);

      row.addEventListener("click", function () {
        var open = detail.classList.toggle("kj-open");
        row.setAttribute("aria-expanded", open ? "true" : "false");
      });

      listEl.appendChild(row);
      listEl.appendChild(detail);
    });
  }

  function buildFilters() {
    var counts = {};
    jobs.forEach(function (j) { counts[j.location] = (counts[j.location] || 0) + 1; });
    var names = ["All"].concat(Object.keys(counts).sort());
    filtersEl.innerHTML = "";
    names.forEach(function (name) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "kj-chip";
      chip.textContent = name === "All" ? "All locations" : name + " (" + counts[name] + ")";
      chip.setAttribute("aria-pressed", name === location ? "true" : "false");
      chip.addEventListener("click", function () {
        location = name;
        filtersEl.querySelectorAll(".kj-chip").forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        render();
      });
      filtersEl.appendChild(chip);
    });
  }

  searchEl.addEventListener("input", function () {
    query = searchEl.value.trim().toLowerCase();
    render();
  });

  fetch(BOARD)
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      jobs = (data.jobs || []).filter(function (j) { return j.isListed !== false; });
      jobs.sort(function (a, b) {
        return a.location.localeCompare(b.location) || a.title.localeCompare(b.title);
      });
      addSummaries(jobs);
      buildFilters();
      render();
    })
    .catch(function () {
      text(countEl, "");
      listEl.innerHTML = '<p class="kj-empty">Our openings could not be loaded just now. ' +
        'You can see them all on <a href="' + FALLBACK + '" target="_blank" rel="noopener">our careers board</a>.</p>';
    });
})();
