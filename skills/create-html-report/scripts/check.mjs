#!/usr/bin/env node
// Check a report in a real browser before handing it over.
//
//   node check.mjs report.html [--local] [--out dir]
//
// Takes four full-page screenshots (desktop + phone, light + dark) and
// prints a JSON summary: console errors, failed charts/diagrams, and any
// element that makes the page scroll sideways on a phone.
//
// --local  swaps the hosted report.css/report.js for the copies in
//          ../assets, so you can test kit changes before they deploy.
//
// Needs puppeteer-core (npm i -g puppeteer-core, or in the current project)
// and a Chrome-based browser. Set CHROME_PATH if Chrome is somewhere unusual.
import { createRequire } from "node:module";
import { access, constants, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { resolve, dirname, basename, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const here = dirname(fileURLToPath(import.meta.url));
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { local: { type: "boolean" }, out: { type: "string" } },
});
if (!positionals[0]) {
  console.error("usage: node check.mjs report.html [--local] [--out dir]");
  process.exit(1);
}

async function loadPuppeteer() {
  const tries = [
    join(process.cwd(), "package.json"),
  ];
  for (const t of tries) {
    try { return createRequire(t)("puppeteer-core"); } catch {}
  }
  try { return (await import("puppeteer-core")).default; } catch {}
  console.error("puppeteer-core not found. Run: npm i -g puppeteer-core (or install it in this project)");
  process.exit(2);
}

const BROWSERS = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
].filter(Boolean);
async function findBrowser() {
  for (const b of BROWSERS) { try { await access(b, constants.X_OK); return b; } catch {} }
  throw new Error("No Chrome-based browser found. Set CHROME_PATH.");
}

let input = resolve(positionals[0]);
const outDir = resolve(values.out || join(dirname(input), ".check-" + basename(input, ".html")));
await mkdir(outDir, { recursive: true });

let tmp = null;
if (values.local) {
  const assets = join(here, "..", "assets");
  tmp = join(dirname(input), "." + basename(input, ".html") + ".local.html");
  const rel = (f) => relative(dirname(tmp), join(assets, f)).split("\\").join("/");
  const html = (await readFile(input, "utf8"))
    .replaceAll("https://alfonsograziano.it/tools/report.css", rel("report.css"))
    .replaceAll("https://alfonsograziano.it/tools/report.js", rel("report.js"));
  await writeFile(tmp, html);
  input = tmp;
}

const puppeteer = await loadPuppeteer();
const browser = await puppeteer.launch({ executablePath: await findBrowser(), headless: true, args: ["--allow-file-access-from-files"] });
const summary = { file: positionals[0], shots: [], errors: [], broken: [], overflow: [] };
try {
  const runs = [
    { name: "desktop-light", width: 1280, height: 900, dark: false, mobile: false },
    { name: "desktop-dark", width: 1280, height: 900, dark: true, mobile: false },
    { name: "phone-light", width: 390, height: 844, dark: false, mobile: true },
    { name: "phone-dark", width: 390, height: 844, dark: true, mobile: true },
  ];
  for (const r of runs) {
    const page = await browser.newPage();
    page.on("console", (m) => { if (m.type() === "error") summary.errors.push(`[${r.name}] ${m.text().slice(0, 300)}`); });
    page.on("pageerror", (e) => summary.errors.push(`[${r.name}] ${String(e.message || e).slice(0, 300)}`));
    await page.setViewport({ width: r.width, height: r.height, deviceScaleFactor: 1, isMobile: r.mobile, hasTouch: r.mobile });
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: r.dark ? "dark" : "light" }]);
    await page.goto(pathToFileURL(input).href, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((res) => setTimeout(res, 2500)); // charts, mermaid, excalidraw
    const info = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const skip = ".scroll-x,.table-wrap,.htimeline,.board,pre,.tab-list,.mermaid,.excalidraw,.chart,.report-tools";
      const overflow = [...document.querySelectorAll("body *")]
        .filter((e) => e.getBoundingClientRect().right > w + 1 && !e.closest(skip) && getComputedStyle(e).position !== "fixed")
        .slice(0, 6)
        .map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].join(".")} "${(e.textContent || "").trim().slice(0, 40)}"`);
      const broken = [
        ...[...document.querySelectorAll(".chart-error")].map((e) => e.textContent.slice(0, 200)),
        ...[...document.querySelectorAll(".chart")].filter((c) => c.querySelector('script[type="application/json"]') && !c.querySelector("canvas")).map(() => "chart did not render"),
        ...[...document.querySelectorAll(".mermaid")].filter((m) => !m.querySelector("svg")).map((m) => "mermaid did not render: " + m.textContent.trim().slice(0, 60)),
        ...[...document.querySelectorAll(".excalidraw")].filter((m) => !m.querySelector("svg")).map(() => "excalidraw did not render"),
      ];
      const linked = [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => /report\.css/.test(l.href))
        || [...document.querySelectorAll("style")].some((s) => s.textContent.includes("report.css · Swiss")); // inlined copy
      const styled = getComputedStyle(document.body).fontFamily.includes("Archivo");
      return { overflow, broken, linked, styled, scrollWidth: document.documentElement.scrollWidth, width: w };
    });
    if (!info.linked) summary.broken.push("report.css is not linked");
    else if (!info.styled) summary.broken.push(`[${r.name}] report.css did not load (is it deployed? try --local)`);
    info.broken.forEach((b) => summary.broken.push(`[${r.name}] ${b}`));
    if (r.mobile && info.scrollWidth > info.width + 1) summary.overflow.push(`[${r.name}] page is ${info.scrollWidth}px wide on a ${info.width}px screen`);
    if (r.mobile) info.overflow.forEach((o) => summary.overflow.push(`[${r.name}] ${o}`));
    const shot = join(outDir, `${r.name}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    summary.shots.push(shot);
    await page.close();
  }
} finally {
  await browser.close();
  if (tmp) await rm(tmp, { force: true });
}
summary.errors = [...new Set(summary.errors)].filter((e) => !/Failed to use workers for subsetting/.test(e));
summary.broken = [...new Set(summary.broken)];
summary.ok = !summary.errors.length && !summary.broken.length && !summary.overflow.length;
console.log(JSON.stringify(summary, null, 2));
process.exit(summary.ok ? 0 : 1);
