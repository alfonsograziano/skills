/* ═════════════════════════════════════════════════════════════════
   report.js · behaviour for report.css pages
   Hosted at https://alfonsograziano.it/tools/report.js
   Source of truth: github.com/alfonsograziano/skills, skills/create-html-report/assets/report.js

   Load it with <script src=".../report.js" defer></script>. It wires
   everything up by itself from markup; a page never has to call it.
   Heavy libraries (Chart.js, Mermaid, Excalidraw, highlight.js) are
   fetched only when the page actually uses them.

   Features (all declarative, see references/components.md):
     .chart > script[type=application/json]   Chart.js, themed
     .mermaid                                  Mermaid, themed
     .excalidraw > script[type=application/json]  Excalidraw scene → SVG
     pre > code[class*=language-]              syntax highlight
     [data-reveal], .bars, .columns, .progress, .stackbar, .donut   animate in
     [data-count]                              count-up numbers
     [data-spark]                              sparklines
     .waffle[data-value]                       100-square waffle
     .tabs > .tab-panel[data-label]            tabs
     .chips[data-filter]                       filter chips
     [data-series-toggle]                      show one chart series at a time
     table.sortable                            click-to-sort
     nav[data-toc]                             table of contents
     [data-calc]                               what-if calculator
     theme toggle + print button               floating, top right

   Changes here are ADDITIVE. Old reports load this file live.
   ═════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var CDN = {
    chart: "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js",
    mermaid: "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs",
    excalidraw: "https://esm.sh/@excalidraw/excalidraw@0.18.0",
    hljs: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js",
  };

  var root = document.documentElement;
  root.classList.add("js");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Hidden tabs, headless Chrome (html-to-pdf) and print never fire the
  // scroll observers, so there we draw everything at once with no motion.
  var eager = reduced || document.visibilityState === "hidden" || navigator.webdriver || /HeadlessChrome/.test(navigator.userAgent) || (window.matchMedia && window.matchMedia("print").matches);
  if (eager) root.classList.add("no-motion");
  var themeListeners = [];

  // ── small helpers ───────────────────────────────────────────────
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function css(el, name) { return getComputedStyle(el || root).getPropertyValue(name).trim(); }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = resolve; s.onerror = function () { reject(new Error("Could not load " + src)); };
      document.head.appendChild(s);
    });
  }
  function once(fn) { var p; return function () { return p || (p = fn()); }; }
  function readJSON(el) {
    var node = el.querySelector('script[type="application/json"]');
    var text = node ? node.textContent : el.getAttribute("data-config");
    if (!text) return null;
    try { return JSON.parse(text); } catch (e) { showError(el, "Bad JSON: " + e.message); return null; }
  }
  function showError(el, msg) {
    var d = document.createElement("div");
    d.className = "chart-error"; d.textContent = msg;
    el.appendChild(d);
    console.error("[report.js]", msg, el);
  }
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function hexToRgba(color, alpha) {
    var c = (color || "").trim();
    if (c.indexOf("rgb") === 0) {
      var parts = c.replace(/rgba?\(|\)/g, "").split(",");
      return "rgba(" + parts[0] + "," + parts[1] + "," + parts[2] + "," + alpha + ")";
    }
    c = c.replace("#", "");
    if (c.length === 3) c = c.split("").map(function (x) { return x + x; }).join("");
    var n = parseInt(c, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
  }

  // ── number formatting (charts, count-up, calculators) ───────────
  function fmt(v, f) {
    if (v == null || isNaN(v)) return "–";
    if (typeof f === "string") f = FORMATS[f] || { style: f };
    f = f || {};
    var d = f.decimals != null ? f.decimals : (Math.abs(v) < 10 && v % 1 !== 0 ? 1 : 0);
    var opts = { minimumFractionDigits: d, maximumFractionDigits: d };
    if (f.compact) { opts.notation = "compact"; opts.maximumFractionDigits = 1; opts.minimumFractionDigits = 0; }
    var s = new Intl.NumberFormat(f.locale || "en-US", opts).format(v);
    return (f.prefix || "") + s + (f.suffix || "");
  }
  var FORMATS = {
    eur: { prefix: "€", decimals: 0 }, eur2: { prefix: "€", decimals: 2 },
    usd: { prefix: "$", decimals: 0 }, usd2: { prefix: "$", decimals: 2 },
    gbp: { prefix: "£", decimals: 0 },
    pct: { suffix: "%", decimals: 0 }, pct1: { suffix: "%", decimals: 1 },
    int: { decimals: 0 }, dec1: { decimals: 1 }, dec2: { decimals: 2 },
    compact: { compact: true }, eurk: { prefix: "€", compact: true }, usdk: { prefix: "$", compact: true },
    x: { suffix: "×", decimals: 1 }, h: { suffix: "h", decimals: 0 }, d: { suffix: "d", decimals: 0 },
  };
  function parseFormat(f) {
    if (!f) return null;
    if (typeof f === "string") return FORMATS[f] || null;
    return f;
  }

  // ── theme toggle + print button ─────────────────────────────────
  function initTheme() {
    try { var saved = localStorage.getItem("report-theme"); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
    if (document.body.hasAttribute("data-no-tools")) return;
    var box = document.createElement("div");
    box.className = "report-tools no-print";
    var t = document.createElement("button");
    t.type = "button"; t.title = "Toggle light / dark"; t.setAttribute("aria-label", "Toggle light or dark theme");
    t.textContent = "◐";
    t.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("report-theme", next); } catch (e) {}
    });
    var p = document.createElement("button");
    p.type = "button"; p.title = "Print / save as PDF"; p.setAttribute("aria-label", "Print");
    p.textContent = "⎙";
    p.addEventListener("click", function () { window.print(); });
    box.appendChild(t); box.appendChild(p);
    document.body.appendChild(box);
  }
  function watchTheme() {
    var fire = function () { themeListeners.forEach(function (fn) { try { fn(isDark()); } catch (e) { console.error(e); } }); };
    new MutationObserver(fire).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq.addEventListener) mq.addEventListener("change", fire);
    }
  }
  function onTheme(fn) { themeListeners.push(fn); }

  // ── reveal on scroll (also starts bar/donut animations) ─────────
  var ANIM = "[data-reveal], .bars, .columns, .progress, .stackbar, .donut, [data-count], .funnel";
  function initReveal() {
    var els = $$(ANIM);
    if (!("IntersectionObserver" in window) || eager) {
      els.forEach(function (el) { el.classList.add("is-in"); if (el.hasAttribute("data-count")) finishCount(el); });
      return;
    }
    // stagger siblings marked data-reveal inside the same parent
    $$("[data-reveal-group]").forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.setAttribute("data-reveal", ""); c.style.setProperty("--i", i); });
    });
    els = $$(ANIM);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("is-in");
        if (el.hasAttribute("data-count")) runCount(el);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
    // safety net: never leave content hidden (e.g. print, very tall pages)
    window.addEventListener("beforeprint", function () { els.forEach(function (el) { el.classList.add("is-in"); if (el.hasAttribute("data-count")) finishCount(el); }); });
  }

  // ── count-up numbers: <span data-count="1234" data-format="eur"> ──
  function countTarget(el) { return parseFloat(el.getAttribute("data-count")); }
  function countFormat(el) {
    var f = parseFormat(el.getAttribute("data-format")) || {};
    if (el.hasAttribute("data-decimals")) f = Object.assign({}, f, { decimals: +el.getAttribute("data-decimals") });
    if (el.hasAttribute("data-prefix")) f = Object.assign({}, f, { prefix: el.getAttribute("data-prefix") });
    if (el.hasAttribute("data-suffix")) f = Object.assign({}, f, { suffix: el.getAttribute("data-suffix") });
    return f;
  }
  function finishCount(el) { el.textContent = fmt(countTarget(el), countFormat(el)); }
  function runCount(el) {
    var to = countTarget(el), f = countFormat(el), start = null, dur = 1100;
    function step(ts) {
      if (!start) start = ts;
      var k = Math.min(1, (ts - start) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(to * e, f);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── sparklines: <span class="spark" data-spark="3,5,2,8"> ───────
  function initSparks() {
    $$("[data-spark]").forEach(function (el) {
      el.classList.add("spark");
      var draw = function () {
        var vals = el.getAttribute("data-spark").split(/[ ,]+/).map(Number).filter(function (n) { return !isNaN(n); });
        if (vals.length < 2) return;
        var w = 100, h = 30, pad = 3;
        var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), span = max - min || 1;
        var pts = vals.map(function (v, i) { return [pad + (i * (w - 2 * pad)) / (vals.length - 1), h - pad - ((v - min) / span) * (h - 2 * pad)]; });
        var line = pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
        var colorName = el.getAttribute("data-color");
        var stroke = colorName ? (css(el, "--" + colorName) || colorName) : css(el, "--ink");
        var last = pts[pts.length - 1];
        var area = el.hasAttribute("data-fill") ? '<polygon points="' + pad + "," + h + " " + line + " " + last[0].toFixed(1) + "," + h + '" fill="' + hexToRgba(stroke, 0.12) + '"/>' : "";
        el.innerHTML = '<svg viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none" aria-hidden="true">' + area +
          '<polyline points="' + line + '" fill="none" stroke="' + stroke + '" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>' +
          '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="2.4" fill="' + css(el, "--accent") + '"/></svg>';
        if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", "Trend: " + vals.join(", "));
        el.setAttribute("role", "img");
      };
      draw(); onTheme(draw);
    });
  }

  // ── waffle: <div class="waffle" data-value="37" data-alt="8"> ───
  function initWaffles() {
    $$(".waffle[data-value]").forEach(function (el) {
      var v = Math.round(+el.getAttribute("data-value")), alt = Math.round(+(el.getAttribute("data-alt") || 0));
      var html = "";
      for (var i = 0; i < 100; i++) html += "<i" + (i < alt ? ' class="on alt"' : i < v + alt ? ' class="on"' : "") + "></i>";
      el.innerHTML = html;
      el.setAttribute("role", "img");
      if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", v + (alt ? " + " + alt : "") + " out of 100");
    });
  }

  // ── tabs ────────────────────────────────────────────────────────
  var tabCount = 0;
  function initTabs() {
    $$(".tabs").forEach(function (box) {
      var panels = $$(":scope > .tab-panel", box);
      if (!panels.length) return;
      var list = document.createElement("div");
      list.className = "tab-list"; list.setAttribute("role", "tablist");
      var n = ++tabCount;
      panels.forEach(function (p, i) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("role", "tab");
        b.id = "tab-" + n + "-" + i; p.id = p.id || "panel-" + n + "-" + i;
        b.setAttribute("aria-controls", p.id); p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", b.id);
        b.textContent = p.getAttribute("data-label") || "Tab " + (i + 1);
        b.addEventListener("click", function () { select(i); });
        list.appendChild(b);
      });
      function select(i) {
        panels.forEach(function (p, j) { p.classList.toggle("is-active", i === j); });
        $$("button", list).forEach(function (b, j) { b.setAttribute("aria-selected", i === j ? "true" : "false"); b.tabIndex = i === j ? 0 : -1; });
        // charts inside a hidden panel have zero size; resize them now
        $$(".chart", panels[i]).forEach(function (c) { if (c._chart) c._chart.resize(); });
      }
      list.addEventListener("keydown", function (e) {
        var cur = $$("button", list).findIndex(function (b) { return b.getAttribute("aria-selected") === "true"; });
        if (e.key === "ArrowRight") { select((cur + 1) % panels.length); list.children[(cur + 1) % panels.length].focus(); }
        if (e.key === "ArrowLeft") { select((cur - 1 + panels.length) % panels.length); list.children[(cur - 1 + panels.length) % panels.length].focus(); }
      });
      box.insertBefore(list, box.firstChild);
      var start = panels.findIndex(function (p) { return p.hasAttribute("data-active"); });
      select(start < 0 ? 0 : start);
    });
  }

  // ── filter chips: <div class="chips" data-filter="#list"> ───────
  function initChips() {
    $$(".chips[data-filter]").forEach(function (box) {
      var target = document.querySelector(box.getAttribute("data-filter"));
      if (!target) return;
      var btns = $$("button, .chip", box);
      btns.forEach(function (b) {
        b.classList.add("chip");
        b.type = "button";
        b.addEventListener("click", function () {
          var v = b.getAttribute("data-value") || "all";
          btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          $$("[data-tags]", target).forEach(function (item) {
            var tags = (item.getAttribute("data-tags") || "").split(/\s+/);
            item.classList.toggle("is-filtered-out", v !== "all" && tags.indexOf(v) < 0);
          });
        });
      });
      var first = btns.find(function (b) { return b.getAttribute("aria-pressed") === "true"; }) || btns[0];
      if (first) first.click();
    });
  }

  // ── sortable tables ─────────────────────────────────────────────
  function cellValue(td) {
    var raw = td.getAttribute("data-sort") || td.textContent.trim();
    var n = parseFloat(raw.replace(/[€$£%,×\s]/g, "").replace(/[kK]$/, "e3").replace(/[mM]$/, "e6"));
    return isNaN(n) ? raw.toLowerCase() : n;
  }
  function initSortable() {
    $$("table.sortable").forEach(function (table) {
      var ths = $$("thead th", table);
      ths.forEach(function (th, col) {
        th.tabIndex = 0;
        var sort = function () {
          var dir = th.getAttribute("aria-sort") === "descending" ? "ascending" : "descending";
          ths.forEach(function (x) { x.removeAttribute("aria-sort"); });
          th.setAttribute("aria-sort", dir);
          var body = table.tBodies[0];
          var rows = Array.prototype.slice.call(body.rows).filter(function (r) { return !r.classList.contains("total"); });
          var totals = Array.prototype.slice.call(body.rows).filter(function (r) { return r.classList.contains("total"); });
          rows.sort(function (a, b) {
            var x = cellValue(a.cells[col]), y = cellValue(b.cells[col]);
            var r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
            return dir === "ascending" ? r : -r;
          });
          rows.concat(totals).forEach(function (r) { body.appendChild(r); });
        };
        th.addEventListener("click", sort);
        th.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sort(); } });
      });
    });
  }

  // ── table of contents: <nav class="toc" data-toc></nav> ─────────
  function slug(s) { return s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60); }
  function initToc() {
    var nav = document.querySelector("[data-toc]");
    // one entry per section: the h2 in its head, or its first h2
    var heads = $$(".section").map(function (sec) { return sec.querySelector(".section-head h2") || sec.querySelector("h2"); }).filter(Boolean);
    heads.forEach(function (h) {
      var sec = h.closest(".section") || h;
      if (!sec.id) sec.id = slug(h.textContent) || "s" + Math.random().toString(36).slice(2, 7);
    });
    if (!nav || !heads.length) return;
    var label = nav.querySelector(".eyebrow");
    if (!label) { label = document.createElement("span"); label.className = "eyebrow"; label.textContent = "Contents"; nav.appendChild(label); }
    var ol = document.createElement("ol");
    var links = heads.map(function (h, i) {
      var sec = h.closest(".section") || h;
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = "#" + sec.id;
      a.textContent = String(i + 1).padStart(2, "0") + "  " + (h.getAttribute("data-toc-label") || h.textContent);
      li.appendChild(a); ol.appendChild(li);
      return { a: a, sec: sec };
    });
    nav.appendChild(ol);
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.a.classList.toggle("is-active", l.sec === en.target); });
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    links.forEach(function (l) { io.observe(l.sec); });
  }

  // ── copy buttons on code blocks ─────────────────────────────────
  function initCopy() {
    $$("pre").forEach(function (pre) {
      if (pre.classList.contains("mermaid") || pre.closest(".mermaid") || pre.hasAttribute("data-no-copy") || !navigator.clipboard) return;
      var b = document.createElement("button");
      b.type = "button"; b.className = "copy-btn"; b.textContent = "Copy";
      b.addEventListener("click", function () {
        var code = pre.querySelector("code") || pre;
        navigator.clipboard.writeText(code.innerText.replace(/\n?Copy$/, "")).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1400); });
      });
      pre.appendChild(b);
    });
  }

  // ── syntax highlighting (lazy) ──────────────────────────────────
  function initHighlight() {
    var blocks = $$('pre code[class*="language-"]');
    if (!blocks.length) return;
    loadScript(CDN.hljs).then(function () {
      blocks.forEach(function (b) { try { window.hljs.highlightElement(b); } catch (e) {} });
    }).catch(function (e) { console.warn("[report.js]", e.message); });
  }

  // ── what-if calculators ─────────────────────────────────────────
  // <div data-calc>
  //   <input type="range" name="rate" value="5" min="0" max="10">
  //   <output data-formula="rate * 2" data-format="pct"></output>
  //   <div class="bars"><div class="bar" data-bar-formula="rate*10">…
  function initCalc() {
    $$("[data-calc]").forEach(function (box) {
      var inputs = $$("input[name], select[name]", box);
      var compiled = {};
      function compile(expr) {
        if (compiled[expr]) return compiled[expr];
        var names = inputs.map(function (i) { return i.name; });
        // eslint-disable-next-line no-new-func
        compiled[expr] = new Function(names.join(","), "with (Math) { return (" + expr + "); }");
        return compiled[expr];
      }
      function values() {
        return inputs.map(function (i) {
          if (i.type === "checkbox") return i.checked ? 1 : 0;
          var n = parseFloat(i.value); return isNaN(n) ? i.value : n;
        });
      }
      function run() {
        var vals = values(), scope = {};
        inputs.forEach(function (i, k) { scope[i.name] = vals[k]; });
        $$("[data-show-value]", box).forEach(function (o) {
          var i = inputs.find(function (x) { return x.name === o.getAttribute("data-show-value"); });
          if (i) o.textContent = fmt(parseFloat(i.value), parseFormat(o.getAttribute("data-format")) || { decimals: (String(i.step || "").split(".")[1] || "").length });
        });
        $$("[data-formula]", box).forEach(function (o) {
          try {
            var v = compile(o.getAttribute("data-formula")).apply(null, vals);
            o.textContent = fmt(v, parseFormat(o.getAttribute("data-format")));
            o.setAttribute("data-raw", v);
            if (o.hasAttribute("data-good-if")) {
              var ok = compile(o.getAttribute("data-good-if").replace(/\bvalue\b/g, "(" + o.getAttribute("data-formula") + ")")).apply(null, vals);
              o.classList.toggle("good-text", !!ok); o.classList.toggle("bad-text", !ok);
            }
          } catch (e) { o.textContent = "err"; console.error("[report.js] formula", o.getAttribute("data-formula"), e); }
        });
        $$("[data-width-formula]", box).forEach(function (o) {
          try { var v = compile(o.getAttribute("data-width-formula")).apply(null, vals); o.style.setProperty("--v", Math.max(0, Math.min(100, v))); } catch (e) {}
        });
        box.dispatchEvent(new CustomEvent("calc", { detail: scope, bubbles: true }));
      }
      inputs.forEach(function (i) { i.addEventListener("input", run); i.addEventListener("change", run); });
      // live outputs must never sit at width 0 waiting for a scroll
      box.classList.add("is-in");
      $$(".bars, .columns, .progress, .stackbar, .donut, .funnel", box).forEach(function (x) { x.classList.add("is-in"); });
      run();
    });
  }

  // ═══ Chart.js ═══════════════════════════════════════════════════
  var loadChart = once(function () { return loadScript(CDN.chart).then(function () { return window.Chart; }); });
  var charts = [];

  function palette(el) {
    return ["--c1", "--c2", "--c3", "--c4", "--c5", "--c6", "--c7", "--c8"].map(function (n) { return css(el, n); });
  }
  function resolveColor(el, c) {
    if (c == null) return c;
    if (Array.isArray(c)) return c.map(function (x) { return resolveColor(el, x); });
    if (typeof c !== "string") return c;
    var named = { accent: "--accent", ink: "--ink", muted: "--muted", grey: "--c3", gray: "--c3", light: "--c4", good: "--good", warn: "--warn", bad: "--bad", info: "--info", paper: "--paper" };
    if (named[c]) return css(el, named[c]);
    if (/^c[1-8]$/.test(c)) return css(el, "--" + c);
    if (c.indexOf("--") === 0) return css(el, c);
    return c;
  }

  function buildChartConfig(el, raw) {
    var cfg = JSON.parse(JSON.stringify(raw));
    var type = cfg.type || "bar";
    var pal = palette(el);
    var ink = css(el, "--ink"), muted = css(el, "--muted"), ruleSoft = css(el, "--rule-soft"), paper = css(el, "--paper-soft") || css(el, "--paper");
    var accent = css(el, "--accent");
    var f = parseFormat(cfg.format);
    var round = type === "doughnut" || type === "pie" || type === "polarArea";
    cfg.data = cfg.data || {};
    // shorthand: top-level labels / datasets
    if (cfg.labels && !cfg.data.labels) cfg.data.labels = cfg.labels;
    if (cfg.datasets && !cfg.data.datasets) cfg.data.datasets = cfg.datasets;
    var ds = cfg.data.datasets || [];
    var hl = cfg.highlight || [];
    if (typeof hl === "number") hl = [hl];
    if (typeof hl === "string") hl = [cfg.data.labels.indexOf(hl)];
    hl = hl.map(function (h) { return typeof h === "string" ? cfg.data.labels.indexOf(h) : h; });

    ds.forEach(function (d, i) {
      var t = d.type || type;
      var given = d.color ? resolveColor(el, d.color) : null;
      delete d.color;
      if (given && !(t === "line" || t === "radar")) { d.borderColor = d.borderColor || given; d.backgroundColor = d.backgroundColor || given; }
      if (given && (t === "line" || t === "radar")) d.borderColor = d.borderColor || given;
      d.backgroundColor = resolveColor(el, d.backgroundColor);
      d.borderColor = resolveColor(el, d.borderColor);
      var base = pal[i % pal.length];
      if (round) {
        if (!d.backgroundColor) {
          // with a highlight, the highlighted slices are red and the rest stay neutral
          var rest = [pal[0], pal[2], pal[3], pal[7], pal[4], pal[5]], k = 0;
          d.backgroundColor = (d.data || []).map(function (_, j) {
            if (!hl.length) return pal[j % pal.length];
            return hl.indexOf(j) >= 0 ? accent : rest[k++ % rest.length];
          });
        }
        if (d.borderColor == null) d.borderColor = paper;
        if (d.borderWidth == null) d.borderWidth = 2;
        if (d.hoverOffset == null) d.hoverOffset = 6;
      } else if (t === "line" || t === "radar") {
        var c = d.borderColor || base;
        d.borderColor = c;
        d.fill = !!d.fill;
        if (d.backgroundColor == null) d.backgroundColor = d.fill ? hexToRgba(c, t === "radar" ? 0.14 : 0.07) : c;
        if (d.borderWidth == null) d.borderWidth = 2;
        if (d.pointRadius == null) d.pointRadius = (d.data || []).length > 24 ? 0 : 3;
        if (d.pointHoverRadius == null) d.pointHoverRadius = 5;
        if (d.pointBackgroundColor == null) d.pointBackgroundColor = c;
        if (d.tension == null) d.tension = 0.25;
        if (d.dashed) d.borderDash = [5, 4];
        if (hl.length && ds.length === 1) {
          d.pointBackgroundColor = (d.data || []).map(function (_, j) { return hl.indexOf(j) >= 0 ? accent : c; });
          d.pointRadius = (d.data || []).map(function (_, j) { return hl.indexOf(j) >= 0 ? 6 : d.pointRadius; });
        }
      } else if (t === "scatter" || t === "bubble") {
        var sc = d.backgroundColor || base;
        d.backgroundColor = hexToRgba(sc, t === "bubble" ? 0.55 : 0.85);
        d.borderColor = d.borderColor || sc;
        if (d.pointRadius == null && t === "scatter") d.pointRadius = 5;
      } else {
        // bar
        var bc = d.backgroundColor || (ds.length === 1 ? pal[0] : base);
        if (hl.length && ds.length === 1 && !Array.isArray(bc)) {
          bc = (d.data || []).map(function (_, j) { return hl.indexOf(j) >= 0 ? accent : pal[0]; });
        }
        d.backgroundColor = bc;
        if (d.borderColor == null) d.borderColor = bc;
        if (d.borderWidth == null) d.borderWidth = 0;
        if (d.borderRadius == null) d.borderRadius = 0;
        if (d.maxBarThickness == null) d.maxBarThickness = 56;
      }
    });

    var o = cfg.options = cfg.options || {};
    if (o.responsive == null) o.responsive = true;
    if (o.maintainAspectRatio == null) o.maintainAspectRatio = false;
    if (eager) o.animation = false;
    o.interaction = o.interaction || { mode: round || type === "scatter" || type === "bubble" ? "nearest" : "index", intersect: round || type === "scatter" || type === "bubble" };
    if (cfg.horizontal) o.indexAxis = "y";
    var p = o.plugins = o.plugins || {};
    p.legend = Object.assign({ display: ds.length > 1 || round, position: round ? "right" : "top", align: "start" }, p.legend || {});
    p.legend.labels = Object.assign({ color: muted, boxWidth: 10, boxHeight: 10, padding: 14, usePointStyle: false }, p.legend.labels || {});
    if (window.innerWidth < 640 && round) p.legend.position = "bottom";
    p.tooltip = Object.assign({
      backgroundColor: ink, titleColor: paper, bodyColor: paper, footerColor: paper,
      borderWidth: 0, cornerRadius: 2, padding: 10, boxPadding: 4, displayColors: ds.length > 1 || round,
      titleFont: { weight: "600" },
    }, p.tooltip || {});
    if (f) {
      p.tooltip.callbacks = p.tooltip.callbacks || {};
      p.tooltip.callbacks.label = function (ctx) {
        var v = ctx.parsed && typeof ctx.parsed === "object" ? (o.indexAxis === "y" ? ctx.parsed.x : ctx.parsed.y) : ctx.parsed;
        if (round) v = ctx.parsed;
        return (ctx.dataset.label ? ctx.dataset.label + ": " : (round ? ctx.label + ": " : "")) + fmt(v, f);
      };
    }
    if (cfg.title && !p.title) p.title = { display: true, text: cfg.title, align: "start", color: ink, font: { size: 14, weight: "700", family: css(el, "--font-display") }, padding: { bottom: 14 } };
    p.valueLabels = cfg.valueLabels ? { format: f, color: ink } : false;

    if (round) {
      if (type !== "pie" && o.cutout == null) o.cutout = type === "doughnut" ? "68%" : undefined;
      if (type === "polarArea") o.scales = Object.assign({ r: { grid: { color: ruleSoft }, ticks: { display: false, backdropColor: "transparent" }, angleLines: { color: ruleSoft } } }, o.scales || {});
    } else if (type === "radar") {
      o.scales = o.scales || {};
      o.scales.r = Object.assign({ grid: { color: ruleSoft }, angleLines: { color: ruleSoft }, pointLabels: { color: ink, font: { size: 12, weight: "500" } }, ticks: { display: false, backdropColor: "transparent" }, beginAtZero: true }, o.scales.r || {});
    } else {
      o.scales = o.scales || {};
      var valueAxis = o.indexAxis === "y" ? "x" : "y", catAxis = o.indexAxis === "y" ? "y" : "x";
      [catAxis, valueAxis].forEach(function (ax) {
        var s = o.scales[ax] = o.scales[ax] || {};
        s.grid = Object.assign({ color: ax === valueAxis ? ruleSoft : "transparent", drawTicks: false }, s.grid || {});
        s.border = Object.assign({ color: ax === catAxis ? css(el, "--rule") : "transparent", width: 1 }, s.border || {});
        s.ticks = Object.assign({ color: muted, padding: 8, font: { size: 11 } }, s.ticks || {});
        if (cfg.stacked) s.stacked = true;
        if (ax === valueAxis) {
          if (s.beginAtZero == null && type !== "scatter" && type !== "bubble") s.beginAtZero = true;
          if (f && !s.ticks.callback) s.ticks.callback = function (v) { return fmt(v, Object.assign({}, f, { decimals: f.decimals && Math.abs(v) < 10 ? f.decimals : 0 })); };
          if (s.ticks.maxTicksLimit == null) s.ticks.maxTicksLimit = 6;
        }
        if (cfg.axis && cfg.axis[ax]) s.title = { display: true, text: cfg.axis[ax], color: muted, font: { size: 11, weight: "500" } };
      });
    }
    // annotation-lite: horizontal/vertical target lines { "target": 70, "targetLabel": "Goal" }
    p.targetLine = cfg.target != null ? { value: cfg.target, label: cfg.targetLabel || "", color: accent, axis: o.indexAxis === "y" ? "x" : "y" } : false;
    delete cfg.highlight; delete cfg.format; delete cfg.horizontal; delete cfg.stacked; delete cfg.title; delete cfg.valueLabels; delete cfg.axis; delete cfg.target; delete cfg.targetLabel; delete cfg.labels; delete cfg.datasets;
    return cfg;
  }

  var pluginsRegistered = false;
  function registerPlugins(Chart) {
    if (pluginsRegistered) return;
    pluginsRegistered = true;
    Chart.register({
      id: "valueLabels",
      afterDatasetsDraw: function (chart, _args, opts) {
        if (!opts || opts === false || !opts.color) return;
        var ctx = chart.ctx, type = chart.config.type;
        ctx.save();
        ctx.font = "600 11px " + (css(chart.canvas, "--font-sans") || "sans-serif");
        ctx.fillStyle = opts.color;
        chart.data.datasets.forEach(function (d, i) {
          var meta = chart.getDatasetMeta(i);
          if (meta.hidden) return;
          meta.data.forEach(function (el, j) {
            var v = d.data[j]; if (v == null || typeof v === "object") return;
            var text = fmt(v, opts.format);
            if (type === "bar") {
              var horiz = chart.options.indexAxis === "y";
              ctx.textAlign = horiz ? "left" : "center"; ctx.textBaseline = horiz ? "middle" : "bottom";
              ctx.fillText(text, horiz ? el.x + 6 : el.x, horiz ? el.y : el.y - 5);
            } else if (type === "line") {
              ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(text, el.x, el.y - 7);
            } else if (type === "doughnut" || type === "pie") {
              var pos = el.tooltipPosition(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
              ctx.fillStyle = "#fff"; ctx.fillText(text, pos.x, pos.y); ctx.fillStyle = opts.color;
            }
          });
        });
        ctx.restore();
      },
    });
    Chart.register({
      id: "targetLine",
      afterDraw: function (chart, _args, opts) {
        if (!opts || opts === false || opts.value == null) return;
        var scale = chart.scales[opts.axis]; if (!scale) return;
        var pos = scale.getPixelForValue(opts.value), area = chart.chartArea, ctx = chart.ctx;
        ctx.save();
        ctx.strokeStyle = opts.color; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
        ctx.beginPath();
        if (opts.axis === "y") { ctx.moveTo(area.left, pos); ctx.lineTo(area.right, pos); } else { ctx.moveTo(pos, area.top); ctx.lineTo(pos, area.bottom); }
        ctx.stroke();
        if (opts.label) {
          ctx.setLineDash([]); ctx.fillStyle = opts.color; ctx.font = "600 10px " + (css(chart.canvas, "--font-sans") || "sans-serif");
          ctx.textAlign = opts.axis === "y" ? "right" : "left"; ctx.textBaseline = "bottom";
          if (opts.axis === "y") ctx.fillText(opts.label.toUpperCase(), area.right, pos - 4); else ctx.fillText(opts.label.toUpperCase(), pos + 4, area.top + 10);
        }
        ctx.restore();
      },
    });
    // doughnut centre text: { "center": { "value": "72%", "label": "done" } }
    Chart.register({
      id: "centerText",
      afterDraw: function (chart, _args, opts) {
        if (!opts || !opts.value) return;
        var meta = chart.getDatasetMeta(0); if (!meta.data[0]) return;
        var x = meta.data[0].x, y = meta.data[0].y, ctx = chart.ctx, r = meta.data[0].innerRadius || 60;
        ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = css(chart.canvas, "--ink");
        ctx.font = "700 " + Math.round(r * 0.5) + "px " + (css(chart.canvas, "--font-display") || "sans-serif");
        ctx.fillText(opts.value, x, y - (opts.label ? r * 0.1 : 0));
        if (opts.label) {
          ctx.fillStyle = css(chart.canvas, "--muted");
          ctx.font = "500 " + Math.max(9, Math.round(r * 0.14)) + "px " + (css(chart.canvas, "--font-sans") || "sans-serif");
          ctx.fillText(String(opts.label).toUpperCase(), x, y + r * 0.32);
        }
        ctx.restore();
      },
    });
  }

  function applyChartDefaults(Chart) {
    Chart.defaults.font.family = css(root, "--font-sans") || "Archivo, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = css(root, "--muted");
    Chart.defaults.borderColor = css(root, "--rule-soft");
    Chart.defaults.animation.duration = eager ? 0 : 900;
    Chart.defaults.animation.easing = "easeOutCubic";
  }

  function renderChart(el) {
    var raw = el._chartRaw || readJSON(el);
    if (!raw) return;
    el._chartRaw = raw;
    return loadChart().then(function (Chart) {
      registerPlugins(Chart); applyChartDefaults(Chart);
      if (el._chart) { el._chart.destroy(); el._chart = null; }
      var canvas = el.querySelector("canvas");
      if (!canvas) { canvas = document.createElement("canvas"); el.appendChild(canvas); }
      if (el.getAttribute("aria-label") && !canvas.getAttribute("aria-label")) { canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", el.getAttribute("aria-label")); }
      var cfg = buildChartConfig(el, raw);
      if (raw.center) { cfg.options.plugins.centerText = raw.center; delete cfg.center; }
      el._chart = new Chart(canvas, cfg);
      if (el.id) Report.charts[el.id] = el._chart;
      return el._chart;
    }).catch(function (e) { showError(el, "Chart failed: " + e.message); });
  }

  function initCharts() {
    var els = $$(".chart");
    els = els.filter(function (el) { return el.querySelector('script[type="application/json"]') || el.hasAttribute("data-config"); });
    if (!els.length) return;
    charts = els;
    // render when near the viewport so the entry animation is seen
    if ("IntersectionObserver" in window && !eager) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { renderChart(en.target); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px 10% 0px" });
      els.forEach(function (el) { io.observe(el); });
      window.addEventListener("beforeprint", function () { els.forEach(function (el) { if (!el._chart) renderChart(el); }); });
    } else {
      els.forEach(renderChart);
    }
    onTheme(function () { els.forEach(function (el) { if (el._chart) renderChart(el); }); });
    window.addEventListener("beforeprint", function () { els.forEach(function (el) { if (el._chart) el._chart.resize(); }); });
  }

  // series toggle: <div class="segmented" data-series-toggle="#chartId"><button data-series="all">All</button><button data-series="0">…
  function initSeriesToggles() {
    $$("[data-series-toggle]").forEach(function (box) {
      var target = document.querySelector(box.getAttribute("data-series-toggle"));
      if (!target) return;
      var btns = $$("button", box);
      btns.forEach(function (b) {
        b.type = "button";
        b.addEventListener("click", function () {
          var c = target._chart; if (!c) return;
          var v = b.getAttribute("data-series");
          c.data.datasets.forEach(function (_, i) { c.setDatasetVisibility(i, v === "all" || String(i) === v); });
          c.update();
          btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        });
      });
      if (btns[0]) btns[0].setAttribute("aria-pressed", "true");
    });
  }

  // ═══ Mermaid ════════════════════════════════════════════════════
  var loadMermaid = once(function () { return import(CDN.mermaid).then(function (m) { return m.default; }); });
  var mermaidCount = 0;
  var MERMAID_CLASSES = {
    hl: function (t) { return "fill:" + t.accent + ",stroke:" + t.accent + ",color:#fff"; },
    dark: function (t) { return "fill:" + t.ink + ",stroke:" + t.ink + ",color:" + t.paper; },
    muted: function (t) { return "fill:" + t.sunk + ",stroke:" + t.ruleStrong + ",color:" + t.muted; },
    good: function (t) { return "fill:" + t.goodSoft + ",stroke:" + t.good + ",color:" + t.ink; },
    warn: function (t) { return "fill:" + t.warnSoft + ",stroke:" + t.warn + ",color:" + t.ink; },
    bad: function (t) { return "fill:" + t.accentSoft + ",stroke:" + t.accent + ",color:" + t.ink; },
    ghost: function (t) { return "fill:transparent,stroke:" + t.ruleStrong + ",stroke-dasharray:4 3,color:" + t.muted; },
  };
  // Mermaid's classDef splits on commas, so rgba(...) breaks it. Flatten
  // translucent tokens onto the paper colour to get a plain hex.
  function toHex(color, bg) {
    var m = /rgba?\(([^)]+)\)/.exec(color || "");
    if (!m) return color;
    var p = m[1].split(",").map(function (x) { return parseFloat(x); });
    var a = p.length > 3 ? p[3] : 1;
    var b = /^#/.test(bg || "") ? bg.replace("#", "") : "ffffff";
    if (b.length === 3) b = b.split("").map(function (x) { return x + x; }).join("");
    var bn = parseInt(b, 16), bb = [(bn >> 16) & 255, (bn >> 8) & 255, bn & 255];
    return "#" + [0, 1, 2].map(function (i) { return Math.round(p[i] * a + bb[i] * (1 - a)).toString(16).padStart(2, "0"); }).join("");
  }
  function mermaidTokens(el) {
    var paper = css(el, "--paper");
    var t = {
      paper: css(el, "--paper"), soft: css(el, "--paper-soft"), sunk: css(el, "--paper-sunk"),
      ink: css(el, "--ink"), muted: css(el, "--muted"), rule: css(el, "--rule"), ruleSoft: css(el, "--rule-soft"), ruleStrong: css(el, "--rule-strong"),
      accent: css(el, "--accent"), accentSoft: css(el, "--accent-soft"),
      good: css(el, "--good"), goodSoft: css(el, "--good-soft"), warn: css(el, "--warn"), warnSoft: css(el, "--warn-soft"),
      font: css(el, "--font-sans"),
    };
    Object.keys(t).forEach(function (k) { if (k !== "font") t[k] = toHex(t[k], paper); });
    return t;
  }
  function renderMermaid(els) {
    if (!els.length) return;
    loadMermaid().then(function (mermaid) {
      var t = mermaidTokens(els[0]);
      var solid = function (c) { return c; };
      mermaid.initialize({
        startOnLoad: false, theme: "base", securityLevel: "loose", fontFamily: t.font,
        flowchart: { curve: "basis", padding: 14, htmlLabels: true, nodeSpacing: 40, rankSpacing: 50 },
        sequence: { actorMargin: 60, mirrorActors: false, messageFontWeight: 500 },
        gantt: { barHeight: 22, fontSize: 12, sectionFontSize: 12, leftPadding: 110 },
        themeVariables: {
          fontFamily: t.font, fontSize: "14px",
          background: t.paper, primaryColor: t.soft, primaryTextColor: t.ink, primaryBorderColor: t.ink,
          secondaryColor: t.sunk, secondaryTextColor: t.ink, secondaryBorderColor: t.ruleStrong,
          tertiaryColor: t.paper, tertiaryTextColor: t.ink, tertiaryBorderColor: t.ruleStrong,
          lineColor: t.muted, textColor: t.ink, mainBkg: t.soft, nodeBorder: t.ink, nodeTextColor: t.ink,
          clusterBkg: t.sunk, clusterBorder: t.ruleStrong, titleColor: t.ink, edgeLabelBackground: t.paper,
          noteBkgColor: solid(t.accentSoft), noteTextColor: t.ink, noteBorderColor: t.accent,
          actorBkg: t.soft, actorBorder: t.ink, actorTextColor: t.ink, actorLineColor: t.muted, signalColor: t.ink, signalTextColor: t.ink,
          labelBoxBkgColor: t.soft, labelBoxBorderColor: t.ink, labelTextColor: t.ink, loopTextColor: t.ink, activationBkgColor: t.sunk, activationBorderColor: t.ink,
          sectionBkgColor: t.sunk, altSectionBkgColor: t.paper, sectionBkgColor2: t.soft, taskBkgColor: t.ink, taskTextColor: t.paper, taskTextLightColor: t.paper, taskBorderColor: t.ink,
          activeTaskBkgColor: t.accent, activeTaskBorderColor: t.accent, doneTaskBkgColor: t.ruleStrong, doneTaskBorderColor: t.ruleStrong, critBkgColor: t.accent, critBorderColor: t.accent, todayLineColor: t.accent, gridColor: t.ruleSoft,
          pie1: css(els[0], "--c1"), pie2: css(els[0], "--c2"), pie3: css(els[0], "--c3"), pie4: css(els[0], "--c4"), pie5: css(els[0], "--c5"), pie6: css(els[0], "--c6"), pie7: css(els[0], "--c7"),
          pieStrokeColor: t.paper, pieOuterStrokeColor: t.rule, pieTitleTextColor: t.ink, pieSectionTextColor: t.paper, pieLegendTextColor: t.ink,
          git0: t.ink, git1: t.accent, git2: css(els[0], "--c3"), git3: css(els[0], "--c5"),
          cScale0: t.ink, cScale1: t.accent, cScale2: css(els[0], "--c3"), cScale3: css(els[0], "--c5"), cScale4: css(els[0], "--c6"),
          quadrant1Fill: solid(t.accentSoft), quadrant2Fill: t.soft, quadrant3Fill: t.sunk, quadrant4Fill: t.soft, quadrantPointFill: t.accent, quadrantTitleFill: t.ink,
          quadrantPointTextFill: t.ink, quadrantXAxisTextFill: t.muted, quadrantYAxisTextFill: t.muted, quadrantInternalBorderStrokeFill: t.ruleStrong, quadrantExternalBorderStrokeFill: t.rule,
        },
      });
      els.reduce(function (chain, el) {
        return chain.then(function () {
          var src = el._mermaidSrc;
          if (/^\s*(flowchart|graph)\b/.test(src)) {
            src += "\n" + Object.keys(MERMAID_CLASSES).map(function (k) { return "classDef " + k + " " + MERMAID_CLASSES[k](t); }).join("\n");
          }
          var id = "mmd-" + (++mermaidCount);
          return mermaid.render(id, src).then(function (res) {
            el.innerHTML = res.svg;
            el.classList.add("is-rendered");
            if (res.bindFunctions) res.bindFunctions(el);
          }).catch(function (e) {
            el.textContent = el._mermaidSrc;
            el.classList.add("is-rendered");
            showError(el, "Mermaid: " + (e && e.message ? e.message.split("\n")[0] : e));
            var stray = document.getElementById("d" + id); if (stray) stray.remove();
          });
        });
      }, Promise.resolve());
    }).catch(function (e) { els.forEach(function (el) { el.classList.add("is-rendered"); showError(el, "Mermaid failed to load: " + e.message); }); });
  }
  function initMermaid() {
    var els = $$(".mermaid");
    if (!els.length) return;
    els.forEach(function (el) {
      // textContent decodes &gt; etc. so arrows written as --&gt; still work
      el._mermaidSrc = el.textContent.replace(/^\n+|\s+$/g, "");
    });
    renderMermaid(els);
    onTheme(function () { renderMermaid(els); });
  }

  // ═══ Excalidraw ═════════════════════════════════════════════════
  var loadExcalidraw = once(function () {
    window.EXCALIDRAW_ASSET_PATH = window.EXCALIDRAW_ASSET_PATH || "https://esm.sh/@excalidraw/excalidraw@0.18.0/dist/prod/";
    return import(CDN.excalidraw);
  });
  function renderExcalidraw(els) {
    if (!els.length) return;
    els.forEach(function (el) { el.classList.add("is-loading"); });
    loadExcalidraw().then(function (mod) {
      var exportToSvg = mod.exportToSvg || (mod.default && mod.default.exportToSvg);
      return els.reduce(function (chain, el) {
        return chain.then(function () {
          var scene = el._scene;
          return exportToSvg({
            elements: (scene.elements || []).filter(function (x) { return !x.isDeleted; }),
            appState: Object.assign({}, scene.appState || {}, { exportBackground: false, exportWithDarkMode: isDark(), exportPadding: 16, exportEmbedScene: false }),
            files: scene.files || {},
          }).then(function (svg) {
            svg.removeAttribute("width"); svg.removeAttribute("height");
            svg.setAttribute("role", "img");
            if (el.getAttribute("aria-label")) svg.setAttribute("aria-label", el.getAttribute("aria-label"));
            var keep = el.querySelector('script[type="application/json"]');
            el.innerHTML = ""; if (keep) el.appendChild(keep);
            el.appendChild(svg);
            el.classList.remove("is-loading");
          });
        }).catch(function (e) { el.classList.remove("is-loading"); showError(el, "Excalidraw: " + e.message); });
      }, Promise.resolve());
    }).catch(function (e) { els.forEach(function (el) { el.classList.remove("is-loading"); showError(el, "Excalidraw failed to load: " + e.message); }); });
  }
  function initExcalidraw() {
    var els = $$(".excalidraw").filter(function (el) {
      var s = readJSON(el);
      if (!s) { if (el.hasAttribute("data-src")) showError(el, "Drawing not embedded yet: run scripts/embed-excalidraw.mjs on this file."); return false; }
      el._scene = s; return true;
    });
    if (!els.length) return;
    renderExcalidraw(els);
    onTheme(function () { renderExcalidraw(els); });
  }

  // ── public API (for the rare custom script) ─────────────────────
  var Report = window.Report = {
    charts: {},
    fmt: fmt,
    formats: FORMATS,
    css: css,
    isDark: isDark,
    onTheme: onTheme,
    palette: function (el) { return palette(el || root); },
    renderChart: renderChart,
    updateChart: function (id, mutate) {
      var el = document.getElementById(id); if (!el) return;
      if (el._chart) { mutate(el._chart); el._chart.update(); }
      else { mutate({ data: el._chartRaw.data || el._chartRaw, config: el._chartRaw }); }
    },
  };

  function init() {
    initTheme();
    watchTheme();
    initToc();
    initTabs();
    initWaffles();
    initSparks();
    initChips();
    initSortable();
    initCopy();
    initCalc();
    initReveal();
    initCharts();
    initSeriesToggles();
    initMermaid();
    initExcalidraw();
    initHighlight();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
