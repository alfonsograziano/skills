#!/usr/bin/env node
// Inline .excalidraw files into a report so it stays one self-contained file.
//
//   node embed-excalidraw.mjs report.html
//
// In the report, write a placeholder where the drawing should go:
//   <div class="excalidraw" data-src="loop.excalidraw" aria-label="…"></div>
// data-src is resolved next to the report. The script puts the scene JSON
// inside the div (report.js turns it into an SVG at load time) and keeps
// data-src, so you can edit the .excalidraw file and run it again.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("usage: node embed-excalidraw.mjs report.html");
  process.exit(1);
}
const path = resolve(file);
let html = readFileSync(path, "utf8");
let count = 0;

// Matches the opening div with data-src, and anything already inside it.
const re = /(<div\b[^>]*class="[^"]*\bexcalidraw\b[^"]*"[^>]*data-src="([^"]+)"[^>]*>)([\s\S]*?)(<\/div>)/g;
html = html.replace(re, (_m, open, src, _inner, close) => {
  const scene = JSON.parse(readFileSync(resolve(dirname(path), src), "utf8"));
  // Keep only what rendering needs; drop editor-only state.
  const slim = {
    type: "excalidraw",
    version: scene.version ?? 2,
    elements: (scene.elements || []).filter((e) => !e.isDeleted),
    appState: { viewBackgroundColor: scene.appState?.viewBackgroundColor ?? "#ffffff" },
    files: scene.files || {},
  };
  count++;
  // "</" inside JSON would close the script tag early.
  const json = JSON.stringify(slim).replace(/<\//g, "<\\/");
  return `${open}\n<script type="application/json">${json}</script>\n${close}`;
});
writeFileSync(path, html);
console.log(`embedded ${count} drawing(s) into ${file}`);
