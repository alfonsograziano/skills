#!/usr/bin/env node
// Make a fully self-contained copy of a report: report.css and report.js are
// pasted into the HTML instead of linked. Use it to preview before the kit is
// deployed, to open a report somewhere that blocks linked files, or to send
// one file that works offline (fonts and chart libraries still come from CDNs).
//
//   node inline.mjs report.html [out.html]
//
// Without out.html it writes <name>.inline.html next to the input.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const [input, output] = process.argv.slice(2);
if (!input) {
  console.error("usage: node inline.mjs report.html [out.html]");
  process.exit(1);
}
const assets = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
const src = resolve(input);
const out = output ? resolve(output) : join(dirname(src), basename(src, ".html") + ".inline.html");
const css = readFileSync(join(assets, "report.css"), "utf8");
// "</script" inside the JS would end the tag early.
const js = readFileSync(join(assets, "report.js"), "utf8").replace(/<\/script/gi, "<\\/script");

let html = readFileSync(src, "utf8");
const linkRe = /<link[^>]*href="[^"]*report\.css"[^>]*>/;
const scriptRe = /<script[^>]*src="[^"]*report\.js"[^>]*><\/script>/;
if (!linkRe.test(html) || !scriptRe.test(html)) {
  console.error("Could not find the report.css <link> or the report.js <script> in " + input);
  process.exit(1);
}
// Functions as replacements, so "$" in the CSS/JS is not treated as a pattern.
html = html.replace(linkRe, () => `<style>\n${css}\n</style>`);
// Inline scripts ignore "defer", so run it after the DOM is parsed.
html = html.replace(scriptRe, () => `<script>\ndocument.addEventListener("DOMContentLoaded", function () {\n${js}\n});\n</script>`);
writeFileSync(out, html);
console.log(out);
