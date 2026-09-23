# Visuals: picking one, and the three engines

Contents: 1 Pick the visual from the question · 2 Chart.js · 3 Mermaid · 4 Excalidraw · 5 Custom SVG

## 1 Pick the visual from the question

Start from what the reader is trying to see, not from the data shape. One visual per question.

| The reader asks… | Use | Engine |
|---|---|---|
| How big is it? (one number) | `.kpi` with `.delta` and a sparkline | CSS |
| How far along? | `.donut`, `.progress`, `.waffle` | CSS |
| Which is biggest? (≤ 10 items) | `.bars`, sorted, top one `.is-top` | CSS |
| Which is biggest, with hover and axis? | bar chart, `highlight` the key one | Chart.js |
| How did it change over time? | line chart (`target` for a goal line) | Chart.js |
| What is it made of? | `.stackbar` (one total) or stacked bar (several totals) | CSS / Chart.js |
| Part of a whole, ≤ 5 slices | doughnut with `center` text | Chart.js |
| How do two things relate? | scatter or bubble | Chart.js |
| How do options score on many criteria? | radar (≤ 3 series) or a table with `.cellbar` | Chart.js / CSS |
| Which option should I pick? | `.versus` + `.procon`, or `.matrix` | CSS |
| When does what happen? | `.timeline`, `.htimeline`, `.gantt` | CSS |
| What are the steps? | `.steps` (a path) or `.flow` (a process) | CSS |
| How does the system fit together? | flowchart / `.layers` | Mermaid / CSS |
| Who talks to whom, in what order? | sequence diagram | Mermaid |
| Where are the patterns in time? | `.heatmap` | CSS |
| What if I change X? | `[data-calc]` calculator | CSS + JS |
| A sketch, a mental model, a whiteboard idea | hand-drawn diagram | Excalidraw |

Design rules that keep it in house style:

- Red means "look here". One red thing per visual: the answer, the recommended option, the current step. Everything else is ink and greys.
- Label directly. Put the value at the end of the bar (`bar-value`, `valueLabels`) instead of making the reader read an axis.
- Sort bars by value unless the order means something (time, stages).
- Title every figure with what it shows (`win-bar`), and caption it with what to notice (`figcaption`). The caption is the insight, not a repeat of the title.
- Never fake precision. If a number is estimated, say so in the caption or a `data-tip`.

## 2 Chart.js

Write the Chart.js config as JSON inside the chart div. report.js loads Chart.js, applies the house theme (fonts, greys, hairline grid, flat bars, ink tooltips, dark mode), picks colours, and redraws on theme change. You write only the data.

```html
<div class="chart" id="spend" aria-label="Monthly spend, Apr to Sep 2026, stacked by category">
  <script type="application/json">
  {"type":"bar","stacked":true,"format":"eur",
   "labels":["Apr","May","Jun"],
   "datasets":[{"label":"Fixed","data":[1100,1100,1150]},{"label":"Variable","data":[500,620,480]}]}
  </script>
</div>
```

Size: default 300px tall. `.chart.sm` 200px, `.chart.lg` 420px, `style="--h:360px"`, `.chart.square` for doughnuts and radars.

Shortcuts report.js understands on top of normal Chart.js config (it strips them before handing over):

| Key | Effect |
|---|---|
| `labels`, `datasets` at top level | Same as inside `data` |
| `format` | Number format for axis ticks, tooltips and value labels. Same names as `data-format` (`eur`, `pct`, `eurk`…) or an object |
| `highlight` | Index, label, or list of them. Single-series bar/line: those bars/points turn red, the rest stay ink. Doughnut: those slices red, the rest grey |
| `horizontal: true` | Horizontal bars |
| `stacked: true` | Stack both axes |
| `valueLabels: true` | Print the value on each bar/point/slice |
| `target`, `targetLabel` | Dashed red goal line across the chart |
| `axis: {"x":"Month","y":"€"}` | Axis titles |
| `center: {"value":"62%","label":"work"}` | Big text in a doughnut's hole |
| `title` | Chart title inside the canvas (prefer the `win-bar` title instead) |
| dataset `color` | `accent`, `ink`, `grey`, `light`, `good`, `warn`, `bad`, `info`, `c1…c8`, a `--token`, or any CSS colour |
| dataset `dashed: true` | Dashed line (plans, forecasts, last year) |
| dataset `fill: true` | Soft area under a line / inside a radar |

Default colours per series: ink, red, grey, light grey, blue, ochre, green. So series 1 is the main one and series 2 is the one you want seen. Reorder datasets to control that, or set `color`.

Any other Chart.js option passes straight through (`options.scales.y.max`, `options.plugins.legend.position`, mixed `type` per dataset…). Keep the JSON valid: double quotes, no trailing commas, no functions. If you need a function (a custom tooltip), use a small script with `Report.updateChart`.

Recipes:

```json
{"type":"line","format":"eurk","target":90000,"targetLabel":"Goal",
 "labels":["Jan","Feb","Mar"],
 "datasets":[{"label":"Actual","data":[61000,63000,62000],"fill":true},
             {"label":"Plan","data":[60000,63000,66000],"dashed":true,"color":"grey"}]}
```

```json
{"type":"bar","horizontal":true,"highlight":"Deep work","valueLabels":true,"format":"h",
 "labels":["Meetings","Deep work","Reviews"],"datasets":[{"label":"Hours","data":[40,8,5]}]}
```

```json
{"type":"doughnut","format":"pct","center":{"value":"62%","label":"work"},
 "labels":["Work","Sleep","Other"],"datasets":[{"data":[62,30,8]}]}
```

```json
{"type":"bubble","axis":{"x":"Effort (days)","y":"Impact"},
 "datasets":[{"label":"Ideas","data":[{"x":3,"y":8,"r":12},{"x":10,"y":4,"r":6}]}]}
```

```json
{"type":"bar","labels":["Q1","Q2","Q3"],
 "datasets":[{"type":"bar","label":"Revenue","data":[10,14,18]},
             {"type":"line","label":"Margin %","data":[20,24,31],"color":"accent","yAxisID":"y1"}],
 "options":{"scales":{"y1":{"position":"right","grid":{"display":false}}}}}
```

Toggle series with buttons (sits nicely in a `win-bar`):

```html
<div class="segmented" data-series-toggle="#nw"><button data-series="all">All</button><button data-series="0">Actual</button><button data-series="1">Plan</button></div>
```

Chart that follows a calculator:

```html
<script>
document.addEventListener("calc", (e) => {
  const { monthly, years } = e.detail;
  Report.updateChart("growth", (c) => {
    c.data.labels = Array.from({ length: years }, (_, i) => "Y" + (i + 1));
    c.data.datasets[0].data = c.data.labels.map((_, i) => monthly * 12 * (i + 1));
  });
});
</script>
```

Always give the chart div an `aria-label` that states what it shows.

## 3 Mermaid

Put Mermaid source in `<pre class="mermaid">`. report.js loads Mermaid 11, themes it from the tokens (flat boxes, ink borders, grey lines, Archivo), and redraws on theme change.

```html
<pre class="mermaid">
flowchart LR
  A[Idea] --> B{Worth it?}
  B -- yes --> C[Spec]:::hl
  B -- no --> D[Park it]:::muted
  C --> E[Ship]:::dark
</pre>
```

Classes ready to use in flowcharts (added for you, do not define them): `:::hl` red, `:::dark` ink-filled, `:::muted` grey, `:::good`, `:::warn`, `:::bad`, `:::ghost` dashed. Use `hl` on one node: the one the reader should look at.

Good fits: `flowchart` (systems, decisions), `sequenceDiagram` (who calls whom), `stateDiagram-v2` (lifecycles), `timeline` (simple dated list), `mindmap` (idea maps), `quadrantChart`, `gitGraph`, `erDiagram`, `journey`, `gantt`. For a precise roadmap prefer the CSS `.gantt`; for a comparison chart prefer Chart.js.

Tips:

- Write arrows as `-->` directly; the browser decodes it fine inside `<pre>`. Avoid `<` and `>` inside labels, use words.
- Quote labels with special characters: `A["Plan (v2)"]`.
- More than about 6 nodes in a row gets tiny: use `flowchart TD`, or group with `subgraph`.
- On phones wide diagrams keep a readable size and scroll sideways. Add `.fit` to the `pre` to shrink instead.
- Wrap it in a `.win` with a title, like any figure.

## 4 Excalidraw

For a hand-drawn look: mental models, whiteboard sketches, "how I think about this". Two ways in:

A. Draw it as a `.excalidraw` file next to the report (you can write the JSON yourself, or the user can draw it at excalidraw.com and save it), then embed:

```html
<div class="excalidraw" data-src="loop.excalidraw" aria-label="Plan, build, check loop"></div>
```

```bash
node <skill>/scripts/embed-excalidraw.mjs report.html
```

The script copies the scene JSON into the div, so the report stays one file. Re-run it after editing the drawing.

B. Inline the scene directly:

```html
<div class="excalidraw" aria-label="…"><script type="application/json">{"type":"excalidraw","version":2,"elements":[…],"appState":{},"files":{}}</script></div>
```

report.js loads Excalidraw from esm.sh (about 1 MB, only when a drawing is on the page), exports the scene to SVG, and re-exports in dark mode.

Writing elements by hand. Each element needs these fields, or it may fail to draw:

```json
{"id":"box1","type":"rectangle","x":0,"y":0,"width":160,"height":70,
 "strokeColor":"#131313","backgroundColor":"#ffffff","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid",
 "roughness":1,"opacity":100,"angle":0,"seed":1,"version":1,"versionNonce":1,"isDeleted":false,
 "groupIds":[],"frameId":null,"boundElements":[{"type":"text","id":"box1-t"}],"roundness":{"type":3},
 "link":null,"locked":false,"updated":1}
```

- Text inside a shape: a `text` element with `"containerId":"box1"`, `"text"`, `"originalText"`, `"fontSize":20`, `"fontFamily":5` (hand-drawn), `"textAlign":"center"`, `"verticalAlign":"middle"`, `"lineHeight":1.25`, plus the common fields above, and list it in the shape's `boundElements`.
- Arrows: `"type":"arrow"`, `"points":[[0,0],[90,0]]`, `"endArrowhead":"arrow"`, `"startArrowhead":null`, `"startBinding":null`, `"endBinding":null`.
- Other types: `ellipse`, `diamond`, `line`, free `text`.
- Colours in house style: ink `#131313`, red `#cd2016` with fill `#fbe3e1`, grey `#7a7a77`. Give every element a different `seed`.
- `assets/gallery.html` has a full working scene to copy from.

Use Excalidraw for one or two sketches per report at most. For anything with more than ~8 boxes, Mermaid is faster to write and easier to change.

## 5 Custom SVG

When no component fits (a custom diagram with real geometry), draw inline SVG. Use `currentColor` and `var(--token)` for every stroke and fill so it follows dark mode (`<rect style="fill:var(--paper-soft);stroke:var(--ink)">`), set a `viewBox` and no fixed width, keep font sizes large in viewBox units (16–28) so labels survive the scale-down on phones, and put long explanations in HTML under the drawing rather than in SVG text.
