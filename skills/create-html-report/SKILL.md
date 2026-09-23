---
name: create-html-report
description: Turn any request, research, data or analysis into a single, highly visual HTML report in a Swiss-modernist house style (the look of alfonsograziano.it and ainativesoftware.engineering). The page links one hosted stylesheet and script, so the work goes into content and visuals, not CSS - KPI tiles, bar and donut charts, interactive Chart.js charts, Mermaid diagrams, Excalidraw sketches, timelines, roadmaps, 2x2 matrices, comparison tables, what-if calculators, tabs, dark mode and print-to-PDF all come ready-made. Use this whenever the user asks for a report, a write-up, a summary page, a one-pager, a dashboard, a comparison, a review, an explainer, a plan, a deep-dive or "something visual" as a file, or says "make it an HTML page", "put this in a report", "visualise this", "give me something I can read / share / print", "create-html-report", even when he does not say HTML. Also use it when research or analysis is finished and the result deserves more than a chat reply. Not for editing the two websites themselves, not for slide decks (pptx-deck) and not for Word documents.
---

# Create HTML report

Write for a visual reader who may not be a native English speaker. A report works when the reader can understand the main point from the shapes before reading a sentence, and when the words are plain. Your job is to turn the request into a page where every section is anchored by a visual, in the house style, as one HTML file.

The style and all the behaviour live in two hosted files, so the HTML you write is only structure and content:

```html
<link rel="stylesheet" href="https://alfonsograziano.it/tools/report.css">
<script src="https://alfonsograziano.it/tools/report.js" defer></script>
```

Their source is `assets/report.css` and `assets/report.js` in this skill. If you fork the skill and want your own look, host your copy of the two files and change the two URLs in `assets/template.html`, `scripts/check.mjs`, `scripts/inline.mjs` and `scripts/localize.mjs`. Do not copy them into the report and do not restyle the components. A `<style>` block of more than a few lines means you are fighting the kit: look for the component first in `references/components.md`.

## Files in this skill

| File | Read it when |
|---|---|
| `references/components.md` | Always, before writing markup. Every class with a copy-paste snippet. |
| `references/visuals.md` | Always. How to pick a visual for each question, plus Chart.js, Mermaid and Excalidraw details. |
| `assets/template.html` | Start every report from it. |
| `assets/gallery.html` | Every component rendered on one page. Copy from it when a snippet is not enough. |
| `scripts/check.mjs` | After writing. Screenshots in 4 modes plus a list of errors. |
| `scripts/embed-excalidraw.mjs` | When the report uses a `.excalidraw` file. |
| `scripts/inline.mjs` | To make a fully self-contained copy (CSS and JS pasted in): previews before the kit is deployed, viewers that block linked files, sending one file. |
| `scripts/localize.mjs` | To point a report at the local kit files by relative path (works from a local server). |
| `scripts/publish-kit.sh` | Only when the kit itself changed and must be deployed. |

## Workflow

### 1. Work out what the reader needs

Before any markup, write down (in your head or a scratch note) three things:

- **The answer.** One sentence that the whole report supports. It becomes the `h1` and the takeaway. If you cannot write it, you do not understand the request yet: ask, or do the research first.
- **The questions.** The 3 to 7 questions the reader will have, in the order they will have them. Each one becomes a section, and the `h2` states the finding ("Rent is half of all spending"), not the topic ("Spending").
- **The visual per question.** Use the table in `references/visuals.md`. Mix engines: a report with only Chart.js charts is as tiring as one with only text.

Get the facts right before making them pretty. If the report needs data you do not have, gather it (read the files, search, ask). Never invent numbers to fill a chart. If a value is an estimate, say so on the page. If a fact comes from an old file, show its date.

### 2. Build the page

Copy `assets/template.html` to the output path and fill it in. Structure that works:

1. **Hero**: eyebrow (kind of report, date), `h1` with the answer, a two-sentence `.lead`, `hero-meta` with sources and "as of" date.
2. **At a glance**: 3 or 4 KPI tiles in `.ruled`, then a `.takeaway`. Someone who stops here should still get the point.
3. **One section per question**: visual first, then at most two or three short paragraphs or a list. Put the visual in a `.win` with a title that says what it shows and a caption that says what to notice.
4. **What to do next**: `.steps` or a `.checklist` with concrete actions, when the report leads to decisions.
5. **Method and sources**: at the end, inside `<details class="acc">`, so it is there without getting in the way.

Rules that keep it readable:

- **Visual density.** Every section opens with a visual. Never three paragraphs in a row. When you catch yourself writing a list of numbers in prose, it wants to be bars or KPIs. When you write "first, then, finally", it wants to be steps or a flow. When you write "on one hand, on the other", it wants to be `.versus` or `.procon`.
- **Plain words.** 8th-grade English: short sentences, common words, explain any term the first time (a `data-tip` works well). Write each paragraph as one line in the HTML source, no manual line breaks.
- **One red thing.** Red marks the answer, the recommended option, the current step. If everything is highlighted, nothing is.
- **Use the tokens.** When you must set a colour inline, use `var(--accent)`, `var(--c3)` and so on, never hex, so dark mode and print keep working.
- **Accessibility.** `aria-label` on every chart and drawing, real headings in order, text for anything shown only by colour.
- **Interactivity with a purpose.** Tabs for alternative views of the same data, a calculator when the reader will ask "what if", filter chips for long lists, accordions for detail. Not for decoration.
- **Privacy.** Leave out the names of employers, clients and private people unless the user wants them on the page.

### 3. Save it

- Save where the user asks. If they do not say, use the project's usual folder for drafts and notes if it has one, otherwise the current working directory.
- File name: short kebab-case, ending in `.html`, for example `savings-plan-2026.html`.
- One self-contained file. Images: prefer inline SVG or CSS components; if a raster image is needed, keep it beside the file with a relative path, and say so.
- If a `.excalidraw` file is used, save it next to the report and run `node <skill>/scripts/embed-excalidraw.mjs <report.html>`.

### 4. Check it in a browser

Run the checker, then look at the screenshots. Do not skip looking: the script catches crashes, not ugliness.

```bash
node <skill>/scripts/check.mjs savings-plan-2026.html
```

It prints JSON with `errors` (console errors), `broken` (charts, diagrams or drawings that did not render), `overflow` (anything that makes the phone view scroll sideways), and paths to four screenshots (desktop and phone, light and dark). It needs a Chrome-based browser and `puppeteer-core` (`npm install -g puppeteer-core`, or install it in the current project). Set `CHROME_PATH` if Chrome is not in the usual place.

If it says `report.css did not load`, the hosted kit is not deployed or you are offline: re-run with `--local` to test against this skill's copy. To give the user something they can open before the kit is live, make a self-contained copy with `node <skill>/scripts/inline.mjs <report.html>` and hand over that file too. Links to `file://` stylesheets do not work in every viewer, so never hand over a copy that relies on them. Also, the Claude app's browser pane shows files outside the project folder as static snapshots with JavaScript off, so charts, diagrams and tabs will not draw there: open reports with `open <file>` (the user's real browser), or serve the folder with a local static server and open it over `http://localhost`.

Read at least the desktop-light and phone-light screenshots (they are tall; that is fine). Fix what looks wrong: a chart that is too small to read, a label that is cut, a section with no visual, a wall of text. Then run the checker again until it passes.

### 5. Hand it over

Open the report for the user (`open <file>` on macOS, `xdg-open` on Linux) and reply with: the path as a clickable link, the answer in one line, and a short list of what the page shows. If they may want a PDF, point them to the ⎙ button or the browser's Print → Save as PDF; the kit has print styles, so the PDF comes out clean.

## Changing the kit

The hosted `report.css` and `report.js` are shared by every report ever written, so changes are additive only: add a class, never rename or remove one, never change what an existing class looks like in a way that breaks older pages.

1. Edit `assets/report.css` / `assets/report.js`, add the new piece to `assets/gallery.html` and a snippet to `references/components.md`.
2. Test with `node scripts/check.mjs assets/gallery.html --local`.
3. Run `bash scripts/publish-kit.sh <path-to-site-repo>` to copy the files into the site's `public/tools/`.
4. Committing and pushing the site deploys it, so ask the site owner before you do it.

When a report needs something the kit does not have, build it inline in that report first. If the same need comes up again, move it into the kit.
