# Component reference

Every class in `report.css` and every behaviour in `report.js`, with the smallest markup that works. Copy a snippet, change the words and numbers. To see them all rendered, open `assets/gallery.html` (run `node scripts/localize.mjs assets/gallery.html` first if the kit is not deployed yet).

Contents: 1 Page skeleton · 2 Type · 3 Layout · 4 Surfaces · 5 Numbers · 6 CSS charts · 7 Time and sequence · 8 Compare and decide · 9 Tables · 10 Text blocks · 11 Interactive · 12 Code · 13 Tokens and utilities

Values like `style="--v:72"` are percentages from 0 to 100 unless said otherwise. Compute them yourself: `--v` = value / max × 100, rounded.

## 1 Page skeleton

```html
<main class="page">            <!-- .page-narrow (820px) for text-heavy, .page-wide (1440px) for dashboards -->
  <header class="hero">…</header>
  <section class="section">
    <div class="section-head">
      <span class="eyebrow">Topic</span>   <!-- CSS adds "01 / " in red automatically -->
      <h2>Heading that states the finding</h2>
      <p>Optional one-line context.</p>
    </div>
    …
  </section>
</main>
```

- `.section-head.split-head`: eyebrow on the left, heading on the right (site style). Use it for short headings only.
- Sticky contents sidebar for long reports (6+ sections), shown from 1100px wide:

```html
<main class="page page-wide">
  <header class="hero">…</header>
  <div class="with-toc">
    <nav class="toc" data-toc></nav>   <!-- report.js fills it from each section's h2 -->
    <div> …sections… </div>
  </div>
</main>
```

Hero meta row: `<dl class="hero-meta"><div><dt class="label">As of</dt><dd>22 Sep 2026</dd></div>…</dl>`.

## 2 Type

| Class / tag | Use |
|---|---|
| `h1` / `.h-xl` | Report title only |
| `h2` / `.h-lg` | Section headings |
| `h3` / `.h-md`, `h4` / `.h-sm` | Card and sub headings |
| `.lead` | The intro paragraph under a title |
| `.eyebrow`, `.label` | Small uppercase labels (label is smaller) |
| `.light` | Lighter weight for part of a headline. The only emphasis device in headlines. No italics anywhere. |
| `.accent` | Red text. Whole words or a trailing `.` only. |
| `.dot-end` | Adds a red full stop after the element |
| `.ink-mark` | Red underline on one phrase |
| `.muted`, `.soft`, `.small`, `.tiny`, `.big`, `.num`, `.tabular`, `.mono` | Obvious |
| `.good-text`, `.warn-text`, `.bad-text` | Status-coloured text |
| `.prose` | Long reading text: 68ch measure, list markers in red, spacing handled |

## 3 Layout

| Class | What it does |
|---|---|
| `.g-2` `.g-3` `.g-4` `.g-5` `.g-6` | Fixed column grids that collapse to 1 column on phones |
| `.grid` (+ `style="--min:220px"`) | Auto-fit grid, as many columns as fit |
| `.split` | 5/7 two-column (text left, visual right). `.split.even` 50/50, `.split.flip` 7/5 |
| `.cols` + `.span-3 … .span-9` | 12-column grid for custom splits |
| `.stack` (+ `style="--gap:2rem"`) | Vertical stack with gap |
| `.row` | Wrapping flex row. Add `.between`, `.items-start`, `.items-end`. `.grow` on a child fills |
| `.ruled` | Cells split by hairlines, no gaps. Best home for KPIs and facts |
| `.scroll-x` | Lets a wide child scroll sideways on phones |

Spacing: `.mt-0…8`, `.mb-0…7`, `.p-0…6`, `.gap-1…6` (1 = 0.25rem, 4 = 1rem, 6 = 2rem, 7 = 3rem). Rules: `.rule-t`, `.rule-b`, `.rule-l`, `.rule-t-strong`, `<hr>`, `.hairline`.

## 4 Surfaces

```html
<div class="card">…</div>            <!-- border turns red on hover -->
<div class="card-flat">…</div>       <!-- no hover -->
<div class="card-flat accent-top">…</div>   <!-- red top edge -->
<div class="card-flat is-highlight ticked">…</div>  <!-- red border + red corner ticks: "the recommended one" -->
<div class="sunk">…</div>            <!-- recessed grey panel -->

<div class="win">                    <!-- titled panel: the default frame for any figure -->
  <div class="win-bar"><span class="win-dot"></span><span class="grow">Title</span> optional controls</div>
  <div class="win-body">…</div>
</div>

<div class="ink">…</div>             <!-- inverted panel; every component inside flips colours -->

<figure class="figure">…<figcaption>What to notice.</figcaption></figure>
```

Buttons (rarely needed in reports): `.btn`, `.btn-ghost`, `.btn-accent`, add `.btn-sm`.

## 5 Numbers

KPI tiles, best inside `.ruled` or `.g-4`:

```html
<div class="ruled">
  <div class="kpi">
    <span class="label">Net worth</span>
    <span class="kpi-value" data-count="84200" data-format="eur">€84,200</span>
    <span class="row gap-2"><span class="delta up">+12.4%</span><span class="kpi-note">vs last year</span></span>
    <span data-spark="61,63,62,68,70,72,75,79,84" data-fill></span>
  </div>
</div>
```

- Units: `<span class="kpi-value">6.1<small>h</small></span>`.
- `.delta.up` (green ▲), `.delta.down` (red ▼), `.delta.flat`. When down is good (cost, churn, error rate) use `.delta.down.good-dir`; when up is bad use `.delta.up.bad-dir`.
- `data-count="1234"` counts up when scrolled into view. Keep the final value as the text so it reads without JS. Options: `data-format`, `data-decimals`, `data-prefix`, `data-suffix`.
- Formats (used everywhere a `format` is accepted): `eur eur2 usd usd2 gbp pct pct1 int dec1 dec2 compact eurk usdk x h d`, or an object `{"prefix":"€","suffix":"/mo","decimals":1,"compact":true}`.
- Sparkline: `<span data-spark="3,5,2,8"></span>`. Options: `data-color="accent|good|warn|c5…"`, `data-fill`, size via `style="--w:160px; --h:40px"`.

Donut / ring with a number inside (`.accent`, `.good`, `.warn`; sizes `.sm`, `.lg`):

```html
<div class="donut accent" style="--v:72"><div><b>72</b><small>score</small></div></div>
```

Big score and a 1-to-N scale:

```html
<div class="score"><b>8.4</b><span>/10</span></div>
<div class="scale" style="--v:8.4; --max:10" data-value="8.4"></div>
<div class="scale-ends"><span>Poor</span><span>Great</span></div>
```

Waffle (100 squares, good for "N out of 100 people/days/goals"): `<div class="waffle" data-value="45" data-alt="18"></div>` → 18 red, 45 ink, rest empty. `style="--size:200px"`.

## 6 CSS charts (no library, animate in, print well)

Use these for simple, static comparisons. Use Chart.js (see `visuals.md`) when the reader should hover, toggle or see an axis.

Horizontal bars, the most useful single component:

```html
<div class="bars" style="--label-w:9rem">
  <div class="bar is-top" style="--v:100"><span class="bar-label">Rent</span><span class="bar-track"><span class="bar-fill"></span></span><span class="bar-value">€850</span></div>
  <div class="bar" style="--v:47"><span class="bar-label">Food</span><span class="bar-track"><span class="bar-fill"></span></span><span class="bar-value">€400</span></div>
  <div class="bar muted-bar" style="--v:8"><span class="bar-label">Other</span><span class="bar-track"><span class="bar-fill"></span></span><span class="bar-value">€70</span></div>
</div>
```

`.is-top` / `.hl` = red row, `.muted-bar` = grey row, `style="--v:40; --c:var(--c5)"` = any colour. `.bars.thick` for fatter bars. Sort rows largest first.

Vertical columns:

```html
<div class="columns" style="--h:180px">
  <div class="column" style="--v:30"><div class="column-fill" data-value="3"></div></div>
  <div class="column hl" style="--v:100"><div class="column-fill" data-value="10"></div></div>
</div>
<div class="column-labels"><span>Apr</span><span>May</span></div>
```

100% stacked bar (children get c1, c2, c3… automatically) plus legend:

```html
<div class="legend"><span><i class="swatch" style="--c:var(--c1)"></i>ETF</span><span><i class="swatch" style="--c:var(--c2)"></i>Bonds</span></div>
<div class="stackbar"><span style="--v:62">62%</span><span style="--v:38">38%</span></div>
```

Progress / meter (`.accent`, `.good`, `.warn`, `.bad`), optional target mark:

```html
<div class="meter">
  <div class="meter-head"><span>Emergency fund</span><b>€9,600 / €12,000</b></div>
  <div class="progress accent target-mark" style="--v:80; --t:100"><i></i></div>
</div>
```

Heatmap (`--v` from 0 to 1; `.cell.ink-scale` for grey scale; `data-tip` for hover text):

```html
<div class="heatmap" style="--cols:7">
  <span></span><span class="h-col">M</span>…<span class="h-col">S</span>
  <span class="h-label">W36</span><i class="cell" style="--v:.9" data-tip="Mon: 2h"></i>…
</div>
<div class="heat-scale">Less <i style="--v:.1"></i><i style="--v:.4"></i><i style="--v:.7"></i><i style="--v:1"></i> More</div>
```

Funnel (last stage red): `<div class="funnel"><div style="--v:100"><span>Visitors</span><b>12,000</b></div><div style="--v:30"><span>Buyers</span><b>240</b></div></div>`.

## 7 Time and sequence

Vertical timeline (`li.done`, `li.now` red, `li.future` dashed and grey):

```html
<ol class="timeline">
  <li class="done"><span class="when">Mar 2026</span><h4>Contract signed</h4><p>One line.</p></li>
  <li class="now"><span class="when">Now</span><h4>Chapter 7</h4><p>One line.</p></li>
  <li class="future"><span class="when">Dec 2026</span><h4>Release</h4></li>
</ol>
```

Horizontal timeline (scrolls on phones): `<ol class="htimeline"><li class="done"><span class="when">Q1</span><strong>Plan</strong><p>…</p></li>…</ol>`.

Numbered steps with a spine (`li.done` shows ✓, `li.now` / `li.capstone` red):

```html
<ol class="steps">
  <li class="done"><div><h4>Tests</h4><p>One line.</p></div></li>
  <li class="now"><div><h4>Gates</h4><p>One line. <span class="badge accent">you are here</span></p></div></li>
</ol>
```

Process flow (boxes and arrows; turns vertical on phones; `.node.hl` red border, `.node.dark` filled; `.flow.loop` adds a "repeats" line; `<div class="arrow" data-label="if yes"></div>` for a labelled arrow):

```html
<div class="flow">
  <div class="node"><span class="eyebrow">01 · Sense</span><strong>Measure</strong><p>One line.</p></div>
  <div class="arrow"></div>
  <div class="node hl"><span class="eyebrow">02 · Act</span><strong>Fix</strong><p>One line.</p></div>
</div>
```

Gantt / roadmap (1-based columns, `--e` is exclusive; `.g-bar.hl` red, `.done` grey, `.ghost` dashed; `.g-milestone` diamond; `.g-now` red today line at `--now`):

```html
<div class="scroll-x"><div class="gantt" style="--cols:12; min-width:560px">
  <div class="g-head"><span></span><div class="g-track"><span>J</span><span>F</span>…12 spans…</div></div>
  <div class="g-row"><span class="g-label">Launch</span><div class="g-track" style="--now:9.5"><span class="g-bar hl" style="--s:3; --e:13">Writing</span><i class="g-now"></i></div></div>
  <div class="g-row"><span class="g-label">Reviews</span><div class="g-track"><i class="g-milestone" style="--s:5"></i></div></div>
</div></div>
```

Layered architecture (top to bottom; `.hl`, `.dark`):

```html
<div class="layers">
  <div><span>Triggers</span><div class="chips"><span class="tag">cron</span><span class="tag">webhook</span></div></div>
  <div class="hl"><span>Control plane</span><div>The new part</div></div>
</div>
```

Kanban board (scrolls sideways): `<div class="board"><div class="lane"><span class="eyebrow">Todo <span>2</span></span><div class="item">…</div><div class="item hl">…</div></div>…</div>`.

## 8 Compare and decide

A vs B (`.winner` gets a red border):

```html
<div class="versus">
  <div class="card-flat">…Option A…</div>
  <div class="vs">vs</div>
  <div class="card-flat winner ticked">…Option B…</div>
</div>
```

Pros and cons:

```html
<div class="procon">
  <div class="pro"><h4>Pros</h4><ul><li>…</li></ul></div>
  <div class="con"><h4>Cons</h4><ul><li>…</li></ul></div>
</div>
```

2×2 matrix (`--x`, `--y` from 0 to 100, y goes up; `--s` dot size; `.pt.hl` red; `.pt.left` puts the label on the left; `.q.win-q` tints the best quadrant). Quadrant order: top-left, top-right, bottom-left, bottom-right.

```html
<div class="matrix">
  <span class="q">Quick wins</span><span class="q win-q">Big bets</span><span class="q">Fill-ins</span><span class="q">Money pits</span>
  <span class="pt hl" style="--x:78; --y:80; --s:1.4">Onboarding</span>
  <span class="pt left" style="--x:85; --y:25">New SaaS</span>
  <span class="axis-x">Effort →</span><span class="axis-y">Impact →</span>
</div>
```

Feature matrix cells in tables: `<td class="yes"></td>` ✓, `<td class="no"></td>` ✕, `<td class="part"></td>` ◐.

## 9 Tables

```html
<div class="table-wrap">
  <table class="sortable">     <!-- click headers to sort; also: .zebra, .compact -->
    <thead><tr><th>Tool</th><th class="num">Price</th><th>Share</th></tr></thead>
    <tbody>
      <tr class="hl"><td>Claude Code</td><td class="num">€90</td><td class="cellbar" style="--v:48">48%</td></tr>
      <tr><td>Cursor</td><td class="num">€20</td><td class="cellbar" style="--v:30">30%</td></tr>
      <tr class="total"><td>Total</td><td class="num">€110</td><td></td></tr>
    </tbody>
  </table>
</div>
```

`tr.hl` = recommended row, `tr.total` stays at the bottom when sorting, `td.cellbar` = in-cell bar, `data-sort="123"` on a td overrides its sort value, `thead.sticky` pins the header.

## 10 Text blocks

```html
<div class="callout note"><strong>Note</strong><p>…</p></div>   <!-- note (blue), tip/good (green), warn (ochre), bad (red), key (red ★) -->
<div class="takeaway"><p>The one thing to remember.</p></div>   <!-- data-label="Verdict" changes the tab text -->
<blockquote class="pull">A line worth quoting.<span class="who">Source</span></blockquote>
<span class="badge good status">on track</span>   <!-- badge: good warn bad info accent ink, .solid; .status adds a dot -->
<span class="tag">cron</span>
```

Lists: `ul.list-arrow` (red arrows), `ol.list-num` (big red 01 02), `ul.list-ruled` (hairline rows), `ul.checklist` with `li.done` / `li.no`, `dl.facts` (label/value rows).

## 11 Interactive

Tabs: write only the panels, report.js builds the buttons. Put alternative views of the same thing in tabs (monthly/yearly, chart/table), never unrelated content.

```html
<div class="tabs">
  <div class="tab-panel" data-label="Chart">…</div>
  <div class="tab-panel" data-label="Table">…</div>
</div>
```

Accordion (for detail most readers skip, like method and sources): `<details class="acc"><summary>How this was measured</summary><p>…</p></details>`.

Filter chips over any items with `data-tags`:

```html
<div class="chips" data-filter="#ideas"><button data-value="all">All</button><button data-value="ai">AI</button></div>
<div class="g-3" id="ideas"><div class="card" data-tags="ai money">…</div></div>
```

Tooltip on anything: `<span data-tip="Explains the term">term</span>`.

Scroll reveal: `data-reveal` on one element, or `data-reveal-group` on a parent to stagger its children. Bars, columns, stack bars, meters, donuts, funnels and counters animate by themselves. Everything respects reduced motion and draws at once when printed.

What-if calculator. Inputs need a `name`; outputs use `data-formula` (plain JS maths, `Math` functions available without the prefix: `pow`, `min`, `round`…):

```html
<div class="win" data-calc>
  <div class="win-bar"><span class="win-dot"></span>What-if · savings</div>
  <div class="win-body calc">
    <div class="stack">
      <div class="field"><label>Monthly saving <output data-show-value="monthly" data-format="eur"></output></label>
        <input type="range" name="monthly" min="100" max="3000" step="50" value="1200"></div>
      <div class="field"><label>Years <output data-show-value="years"></output></label>
        <input type="range" name="years" min="1" max="30" value="10"></div>
    </div>
    <div class="calc-out">
      <div class="kpi"><span class="label">Total saved</span><span class="kpi-value" data-formula="monthly*12*years" data-format="eur"></span></div>
      <div class="progress accent" data-width-formula="min(100, monthly*12*years/500000*100)"></div>
      <b data-formula="monthly*12*years" data-format="eur" data-good-if="value >= 100000"></b>
    </div>
  </div>
</div>
```

`data-width-formula` sets `--v` (so it drives `.progress`, `.bar`, `.donut`). `data-good-if` colours the output green or red. The box fires a `calc` event with all values in `event.detail` if a chart must follow the sliders (see `visuals.md`).

The floating ◐ (theme) and ⎙ (print) buttons appear on every report. `<body data-no-tools>` hides them.

## 12 Code

```html
<pre><code class="language-ts">const x = 1;</code></pre>   <!-- highlighted automatically, copy button on hover -->
<div class="terminal"><div class="terminal-bar">zsh</div><pre><span class="prompt">$</span> npm run lint
<span class="out">✓ 0 errors</span></pre></div>
<kbd>⌘</kbd> <kbd>K</kbd>
```

Escape `<`, `>` and `&` inside code as `&lt;` `&gt;` `&amp;`.

## 13 Tokens and utilities

Colours are CSS variables that switch in dark mode, so use them instead of hex anywhere you set a colour inline:

| Token | Meaning |
|---|---|
| `--paper`, `--paper-soft`, `--paper-sunk` | Page, card, recessed |
| `--ink`, `--ink-soft`, `--muted`, `--muted-soft` | Text, strongest to weakest |
| `--rule`, `--rule-soft`, `--rule-strong` | Lines |
| `--accent`, `--accent-soft` | The one red |
| `--good`, `--warn`, `--bad`, `--info` (+ `-soft`) | Status |
| `--c1 … --c8` | Data series: ink, red, grey, light grey, steel blue, ochre, green, pale grey |

Utilities: `.center`, `.right`, `.nowrap`, `.balance`, `.upper`, `.w-full`, `.max-measure`, `.hidden`, `.sr-only`, `.no-print`.
