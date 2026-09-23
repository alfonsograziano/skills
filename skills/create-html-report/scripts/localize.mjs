#!/usr/bin/env node
// Point a report at the local report.css / report.js instead of the hosted copy.
// Use it to preview changes to the kit before they are deployed, or to check
// a report while offline.
//
//   node localize.mjs report.html [out.html]
//
// Without out.html it writes <name>.local.html next to the input.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const [input, output] = process.argv.slice(2);
if (!input) {
  console.error("usage: node localize.mjs report.html [out.html]");
  process.exit(1);
}
const assets = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
const src = resolve(input);
const out = output ? resolve(output) : join(dirname(src), basename(src, ".html") + ".local.html");
// Relative paths work both from file:// and from a local static server.
const rel = (f) => relative(dirname(out), join(assets, f)).split("\\").join("/");
const html = readFileSync(src, "utf8")
  .replaceAll("https://alfonsograziano.it/tools/report.css", rel("report.css"))
  .replaceAll("https://alfonsograziano.it/tools/report.js", rel("report.js"));
writeFileSync(out, html);
console.log(out);
