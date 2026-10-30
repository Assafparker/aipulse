---
name: AiPulse
description: סריקה יומית של AI בבריאות. A daily Hebrew digest of AI in healthcare, set as hospital floor wayfinding.
colors:
  floor: "#0d1322"
  floor-2: "#121a2d"
  surface: "#18213a"
  ink: "#eef1f6"
  ink-2: "#c3cad8"
  ink-3: "#9aa4b6"
  rule: "#2b3651"
  lane: "#222c44"
  focus: "#eef1f6"
  sign: "#1d315e"
  sign-2: "#2a4280"
  top: "#1a1544"
  top-2: "#2d2670"
  sign-ink: "#ffffff"
  sign-ink-2: "#cdd6eb"
  cat-rnd: "#0098d4"
  cat-health: "#00a33c"
  cat-reg: "#dc241f"
  cat-infra: "#ffd300"
typography:
  display:
    fontFamily: "Rubik, Arial Hebrew, sans-serif"
    fontSize: "clamp(2.75rem, 10vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Rubik, Arial Hebrew, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  room-number:
    fontFamily: "Rubik, Arial Hebrew, sans-serif"
    fontSize: "clamp(1.75rem, 6vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  section:
    fontFamily: "Rubik, Arial Hebrew, sans-serif"
    fontSize: "clamp(1.4rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Rubik, Arial Hebrew, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.005em"
  title-mobile:
    fontFamily: "Rubik, Arial Hebrew, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Assistant, Arial Hebrew, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Rubik, Arial Hebrew, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.25
  nav:
    fontFamily: "Rubik, Arial Hebrew, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
rounded:
  none: "0px"
  dot: "9999px"
spacing:
  module: "4px"
  card-gap-mobile: "12px"
  card-gap: "24px"
  gutter: "16px"
  gutter-wide: "24px"
  section: "80px"
components:
  button-door:
    backgroundColor: "{colors.sign-ink}"
    textColor: "{colors.top}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-door-hover:
    backgroundColor: "{colors.sign-ink-2}"
  button-sign-ghost:
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-sign-ghost-hover:
    backgroundColor: "{colors.top-2}"
  button-state:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "40px"
  button-state-pressed:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
  button-submit:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  button-submit-hover:
    backgroundColor: "{colors.sign-2}"
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  input-search-sign:
    backgroundColor: "{colors.top-2}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "40px"
  nav-link:
    textColor: "{colors.sign-ink-2}"
    typography: "{typography.nav}"
    rounded: "{rounded.none}"
    padding: "0 10px"
    height: "40px"
  nav-link-current:
    textColor: "{colors.sign-ink}"
  topic-tag:
    backgroundColor: "{colors.floor-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  topic-tag-boosted:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
  badge-pinned:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  room-plate:
    textColor: "{colors.sign-ink}"
    typography: "{typography.room-number}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
---

# Design System: AiPulse

## Overview

**Creative North Star: "Corridor Lines"**

AiPulse is set as hospital floor wayfinding. The ground is the corridor at night (a deep navy-black floor), or warm paper in the light theme; the structure is enamel signage with white Hebrew — indigo at the top of the site, navy everywhere else; and every topic category is a coloured line painted on that floor. Floor lines lead to departments, and the departments here are the topic categories: R&D, health services, regulation and policy, infrastructure. The digest is the corridor a clinician walks each morning: the sign tells you where you are and what day it is, the lines leave from under the sign, and each item stands on its own category's line. A colour on this site always means "this department", nothing else. What kind of source an item comes from is carried by the line's pattern (solid or dashed) and by text, never by colour.

The system is dense and sober. Headlines pack tightly down an unbroken rail, controls are square sign plates, and depth comes from the navy panels against the floor rather than from shadows. Dark is the default world (the corridor at night, signs lit); light is warm paper under the same navy signs, reached only by the manual toggle and remembered. The site refuses the dark card-grid news aggregator and the cream broadsheet.

There are two living elements. The floor lines paint themselves: on load the lines switch on category after category; on scroll each item's lane draws down its rail, then its line bends off the rail and runs into the headline. And the logo beats: its centre dot pulses once, four ripples in the category colours run out to the ring and tint it in turn, the ring settles back to ivory and the flagged dot pops in, on load and on hover or tap. Nothing else moves, and with reduced motion nothing moves at all.

**Key Characteristics:**
- Night-corridor floor (dark, default) or warm paper (light), an indigo top sign, navy enamel sign panels below, white signage type.
- Four category line colours, reserved exclusively for topic categories.
- Primary source = solid line + filled dot; secondary reporting = dashed line + hollow dot.
- One 4px line module governs lanes, gaps, strips, branches and heavy rules.
- Square corners everywhere, no shadows.
- Rubik for signage (headings, numerals, controls); Assistant for reading.
- Dark by default; the OS colour preference is never consulted; a manual choice is remembered.
- One motion system (GSAP), transforms only, static under reduced motion.
- RTL first, logical properties only.

## Colors

A floor and navy enamel carry the whole interface; the only saturated colour on the page is a category line, in colours taken after the London Underground line palette.

All tokens are CSS custom properties on `:root` in their dark values (app/globals.css); `:root[data-theme="light"]` is the only override block. Tailwind v4 reads them through `@theme inline`, so utilities follow a theme switch. The frontmatter records the dark (default) values; light values are in the tables below and in the sidecar.

### Primary
- **Indigo Top Sign** (top): the top of the site only — the site header and the home hero sign (brand, intro, door buttons, room plate). #1A1544 in both themes: the top area is dark in light mode too, so it is defined once on `:root` and never overridden. Dedicated rather than shared: no other panel, plate or state uses it.
- **Top Hover** (top-2, #2D2670): hover fill for links and buttons on the top sign, and the header search field. Text and marks on the top sign keep the sign inks below.
- **Navy Enamel Sign** (sign): the shared navy for every other sign panel and state. Archive month directory, pressed state of every toggle, boosted topic tags, the pinned badge, date-group headings in the feed, the 4px top rule on the footer and on method principles. Also the text-selection colour.
- **Lit Sign Hover** (sign-2): hover fill for links and buttons on a navy sign panel (the archive directory), and the hover of the navy submit plate.
- **Sign White** (sign-ink): all text and icon strokes on a sign panel; the fill of the "door" call to action. Hairlines on the sign are this colour at 15-40% opacity.
- **Sign Secondary** (sign-ink-2): subtitles, field labels and inactive nav links on the sign.

### Secondary: the category lines
One colour per topic category, in lane order from the inline start (`CATEGORIES` in lib/constants.ts). Each category groups several of the schema's topics. The palette takes after the London Underground line colours, colour only: no roundel, logo, typeface or line names. Lines are graphics, so every category colour holds at least 3:1 against both floor tones of its theme; dark takes the saturated values, light darkens what fails on paper.

| Category (token) | Topics | Line colour | Dark (default), on floor / floor-2 | Light, on floor / floor-2 |
|---|---|---|---|---|
| מו"פ, R&D (cat-rnd) | research, funding | light blue | #0098D4, 5.7 / 5.3 | #0084C0, 4.0 / 3.6 |
| שירותי בריאות, health services (cat-health) | imaging, adoption, ambient, mental, ops | green | #00A33C (lifted from #00782A to read on navy), 5.6 / 5.2 | #00782A, 5.4 / 4.9 |
| רגולציה ומדיניות, regulation and policy (cat-reg) | policy, ethics, national-strategies | red | #DC241F, 3.8 / 3.6 | #DC241F, 4.7 / 4.2 |
| תשתיות, infrastructure (cat-infra) | interop, marketplace, foundation-models | yellow | #FFD300, 12.9 / 12.0 | #9C7F00 (#B89600 is 2.7:1 on paper), 3.7 / 3.3 |

**Which line an item stands on.** An item's line is the category of its first topic (`lineCategory`). Its other topics stay text tags. `israel` is a geography, not a department: it belongs to no category, stays a plain tag and an uncoloured filter chip, and an item listing it first takes the category of its next topic. A new topic joins a category by being added to that category's `topics` list; it gains no colour of its own.

Each item sets `--line` to its category token, and its lane, bend, run, category swatch and headline underline read from it. Outside a category `--line` falls back to ink-3, the neutral used for source-type swatches. The logo's ripples are the one place the category colours appear outside a line: they pass through the mark in lane order and never stay (see Logo motion). The logo's resting yellow flag (#FFD300) is part of the mark and does not denote a category.

### Neutral
| Role (token) | Dark (default) | Light (warm paper) |
|---|---|---|
| Floor (floor): page background | #0D1322 | #FBFAF7 |
| Floor shade (floor-2): legend band, footer, unboosted tags, scrollbar track | #121A2D | #F1EEE7 |
| Surface (surface): input fields on the floor | #18213A | #FFFFFF |
| Ink (ink): headlines, primary text, 2px heavy rule | #EEF1F6 | #1A1F2B |
| Ink secondary (ink-2): summaries, source names, controls at rest | #C3CAD8 | #404756 |
| Ink tertiary (ink-3): date labels, counts, placeholders, hover borders | #9AA4B6 | #5C6270 |
| Rule (rule): hairline dividers, control borders | #2B3651 | #D6D1C6 |
| Unpainted lane (lane): the three inactive lanes | #222C44 | #E2DED5 |
| Focus (focus): the focus ring off the sign | #EEF1F6 | #1A1F2B |
| Top sign (top) / top hover (top-2) | #1A1544 / #2D2670 | #1A1544 / #2D2670 (not overridden) |
| Sign (sign) / sign hover (sign-2) | #1D315E / #2A4280 | #13203B / #22325A |
| Sign secondary (sign-ink-2) | #CDD6EB | #C5CEE0 |

Text contrast (WCAG AA): light ink 15.8:1, ink-2 8.0:1 or better and ink-3 5.3:1 or better on both paper tones; dark ink-2 11.3:1 and ink-3 6.9:1 or better; sign secondary 7.9:1 or better in both themes.

On the indigo top sign: sign-ink 17.0:1; sign-ink-2 11.7:1 (dark) and 10.8:1 (light); door label (top on white) 17.0:1, 11.7 / 10.8 on its hover fill; white on the top-2 hover and field fill 12.9:1, placeholder (sign-ink-2) 8.9 / 8.2. The header search field's border is white at 40% (3.7:1 against the indigo, the 3:1 a field boundary needs; 30% was 2.65:1). The 3px white focus ring and the 2px white room-plate frame are 17.0:1.

**The Top Edge Rule.** Indigo sits at 1.09:1 against the dark floor, too close to read as an edge, so the top area always ends on a 1px sign-ink hairline at 25%: on every page under the header sign, and on the home page under the hero sign instead (the header, which runs straight into the hero, drops its own; `.header-sign` in globals.css). The category strip follows directly beneath it. On paper the indigo is 16.3:1 and the hairline is simply part of the sign.

### Named Rules
**The Category Colour Rule.** A category colour is used for its topic category only: the item's lane, bend and run, the category swatch beside its name (item row, legend, filter), and the headline's hover underline. Never as a general accent, link colour, button fill or state colour, and never for a source family. Interactive state is navy.

**The Uncoloured Source Rule.** Source family is secondary information and carries no colour: its icon, the primary/secondary dot and its filter swatches are neutral ink. Source type reaches the reader through the line pattern on the coloured category line and through the family name as text.

**The Solid and Dashed Rule.** Primary sources (labs, journals, preprints, regulators) are painted solid with a filled dot; secondary reporting (hospitals, leading voices, press) is painted dashed (10px dash, 6px gap) with a hollow dot. The pattern applies to the item's category-coloured line; the dot is neutral ink-2. The two encodings always travel together, and the screen-reader text says "מקור ראשוני" or "דיווח משני".

**The Dark Default Rule.** Dark is the default unconditionally, on every first visit. `prefers-color-scheme` is not read anywhere. Only the manual toggle changes the theme: it writes `data-theme` on `<html>` and persists it in localStorage under `aipulse:theme`, and a blocking head script (lib/theme.ts) replays it before first paint, so a manual choice is remembered. With no `data-theme`, the toggle treats the current theme as dark.

## Typography

**Display Font:** Rubik (variable, Hebrew + Latin, via next/font; fallback Arial Hebrew, sans-serif)
**Body Font:** Assistant (variable, Hebrew + Latin, via next/font; fallback Arial Hebrew, sans-serif)

**Character:** Rubik is the signage grotesk. Rounded-shouldered, heavy at weight 800, it carries every heading, the brand, every number and every control. Assistant is the quieter reading face for summaries and running prose.

### Hierarchy
- **Display** (800, clamp(2.75rem, 10vw, 6rem), 0.9, -0.035em): the AiPulse name on the home sign only.
- **Headline** (800, clamp(2.5rem, 7vw, 4.5rem), 1, -0.03em): page titles on feed, archive, method and search.
- **Room Number** (700, clamp(1.75rem, 6vw, 3.25rem), 1, -0.02em, tabular): the last-scan date framed in a 2px white plate on the home sign.
- **Section** (700, clamp(1.4rem, 4vw, 2.5rem), tight, -0.02em): section headings on the floor.
- **Title** (600, 1.1875rem mobile / 1.3125rem from sm, snug, -0.005em): item headlines, set on the category's bend.
- **Body** (Assistant 400, 1.0625rem, 1.6-1.65; summaries 1rem on mobile): summaries capped at 64ch, method prose at 60ch, line-height up to 1.75.
- **Label** (Rubik 500, 0.8125rem): family name, category name (600), toggle and state-button labels, legend entries. Meta and tags at 0.75rem.
- **Nav** (Rubik 500, 0.9375rem): header directory, footer links, "all of the feed" style text links.

### Named Rules
**The Room Number Rule.** Every date and count is set in Rubik with tabular numerals and no wrapping (the `time` element and `.tnum`). Dates are ISO (2026-10-20) and bidi-isolated as LTR text.

**The Signage Face Rule.** Rubik carries anything a reader navigates by: headings, numerals, controls, labels. Assistant carries only what is read through.

## Layout

The page is a single centred column, 72rem (1152px) max, with 16px gutters (24px from 640px). Section spacing between home bands is 80px; page tops sit 40px below the header (56px from 640px).

**The rail.** Every item is a row with a lane rail at the inline start. From 640px the rail holds four lanes, one per topic category in CATEGORIES order, each 4px wide with 4px between them; the item's own lane is painted over its slot. At the headline the line bends off the lane: a 14px-radius quarter-turn (`.title-bend`: two logical borders and one rounded corner, so RTL mirrors it; dashed for secondary sources) leaves the lane, and a 4px run (`.title-branch`) carries on into the headline, stopping 6px short of the first letter, like a floor line turning into a room. On a phone there is no room to turn: the run alone carries the line from the single lane to the headline. Below 640px the three other lanes step aside and only the item's own line is painted, still 4px wide, with a 12px gap to the content (24px from 640px). Rows stack with no gap between them so lanes run unbroken down a list; each row is divided by a 1px rule.

**The line strip.** Under every sign, four solid 4px category lines (4px apart) run full width in lane order. On the home page the header's own strip and brand lockup are hidden and the strip leaves from under the big sign instead.

**Feed.** From 1024px the feed is a two-column layout: a 288px filter column (view tabs, sort, categories and topics, source type, topic preferences) and the list. Below that the filters collapse behind a full-width navy toggle bar. List headers sit on a 2px ink rule.

**Home.** The sign band is a grid: brand, subtitle and door buttons at the start; the room-number plate and a two-cell placard of counts at the end (side by side from 1024px). On a phone the line legend moves below the latest items so headlines reach the first screen.

**RTL.** `<html lang="he" dir="rtl">`. Only logical properties (`ms`/`me`, `ps`/`pe`, `inset-inline-*`, `border-s`). Neutral-leading strings get the `.ltr` isolate class on text elements only, never on a positioned element. The wayfinding arrow points toward the inline end (left).

Breakpoints are Tailwind's defaults: 640px, 768px, 1024px.

## Elevation & Depth

The system is flat. There are no shadows anywhere. Depth is conveyed by material: navy enamel panels sit against the floor, recessed bands use floor-2, and weight comes from rules: 1px hairlines between rows, a 2px ink rule under list headers, and a 4px navy rule at the top of the footer and above each method principle. Dimmed items (a "less" topic preference) drop to 60% opacity; they are never hidden.

### Named Rules
**The Enamel Not Shadow Rule.** If something needs to stand forward, it becomes a navy sign plate or gains a heavier rule. It never gains a shadow.

## Shapes

Square corners throughout (0px): buttons, inputs, tags, panels, plates, segmented tabs. The round forms are the primary/secondary dot (10px circle, 2px ink-2 border, filled for primary) and the logo, which is built from circles. Icons are inline SVG strokes, square line caps and mitre joins for wayfinding marks (arrow, external link). Segmented controls (view tabs, sort, topic preferences) are built from adjoining bordered cells overlapping by 1px, with the pressed cell lifted into navy.

**The 4px Module Rule.** One 4px module sets the lane width, lane gap, strip line height and gap, branch thickness and the heaviest rule. A new line-like element is 4px, or one of the existing rule weights (1px hairline, 2px heavy rule, 3px focus ring and current-page bar), never an arbitrary weight.

## Components

### Buttons
Sign plates: square, flat, Rubik.
- **Shape:** square (0px).
- **Door (primary, on the home sign):** white fill, indigo (top) text, Rubik 600, 48px tall, 24px inline padding, followed by the drawn start-pointing arrow. Hover fades the fill to sign-ink-2.
- **Sign ghost:** 1px white border at 40% opacity, white text; hover takes a full-white border and the top-2 fill.
- **State button (pin, save, already-read):** 1px rule border, ink-2 label at 0.8125rem/500, 44px tall on a phone and 40px from 640px. Hover darkens border and text. Pressed (`aria-pressed`) turns navy with white text. "Already read" stands apart from pin and save by a 12-24px gap.
- **Icon buttons on the header sign** (theme toggle, mobile search): 44px square (40px from 640px), white-30% border (the white icon itself carries the contrast, 17.0:1), top-2 hover fill.
- **Focus:** a 3px ink outline offset 2px everywhere; white on a sign panel.

### Chips
- **Topic tag:** floor-2 fill, ink-2 text, Rubik 0.75rem, 2px by 8px padding, square. A topic the reader boosted turns navy with white text.
- **Pinned badge:** the same plate in navy.

### Cards / Containers
Items are not cards. They are rows standing on the floor: no fill, no border box, no radius, no shadow, divided by a 1px rule, with the rail at the inline start. Empty states use a 1px dashed ink-3 frame with 24px padding.

### Inputs / Fields
- **On the floor:** surface fill, 1px ink-3 border, square, 44px tall; focus darkens the border to ink and shows the focus ring. Joined to a navy submit plate.
- **On the header sign:** top-2 fill, white-40% border (3.7:1 on indigo), white text, 208px wide, joined to a submit plate with the same border; focus takes a full-white border.
- **Checkboxes** use the navy accent colour.

### Navigation
The header is the department sign: indigo (top), brand lockup (logo + "AiPulse" in Rubik 800) at the start, directory links in Rubik 0.9375rem/500, search and theme toggle at the end. Links rest at sign-ink-2, hover to white on top-2, and the current page is white with a 3px white bar along the bottom (`aria-current="page"`). On a phone the directory wraps to its own row (except on home, where it shares the first row). The footer is a floor-2 band under a 4px navy rule; the disclosure line comes first, then the links.

### Item Row (signature)
Row 1: dot, family icon in ink-3, family label, source name; the update and publication dates at the end, labelled. Then the headline (linked to the primary source, category-coloured 2px underline on hover) set on its bend, the source's own headline, the summary, the category name with a 14px line swatch followed by the topic tags, and the action row with "למקור" and an external-link icon at the inline end. Headlines-only mode collapses the source headline, summary and tags; the category name then stays in the screen-reader text. Open item: compact rows still keep the full action row; it is not yet a rule that they do.

### Line Strip and Legend (signature)
The strip is the decorative stack of four 4px category lines under a sign. The legend is the real key: per category a 20px line swatch, the name, and its topics beneath in ink-3, two columns on a phone and a wrapped row from 640px; then, in neutral ink, the two patterns: "קו רציף: מקור ראשוני" and "קו מקווקו: דיווח משני". The strip (across, under the sign) and the item rail (down the list) stay two line systems; the turn the system draws is each item's bend from its lane into its headline.

### Feed Filters
- **Categories and topics (main filter, coloured).** Each category is a checkbox row with its 24px line swatch, its name in Rubik 600, and a count; its topics follow as indented, text-only checkbox rows with counts. Inclusive: nothing selected shows everything; once anything is selected, an item shows when any of its topics is selected, not only the first one. A category selects or clears all its topics, and reads mixed (indeterminate) when only some are on. Israel follows as a plain chip below a hairline. A "הצג הכול" text button clears the selection. Counts are items touching the category or topic through any of their topics. The selection persists as `topicsOn` in the reader state.
- **Source type (secondary, uncoloured).** One row per scanned family: checkbox, a neutral solid or dashed swatch, the ink-3 family icon, name, count. Switching a family off hides it. Combined with the topic filter by AND.
- **Topic preferences.** More, neutral, less per topic, listed in category order.

### Room Plate (signature)
The last scan date as a room number: Rubik 700 in a 2px white frame on the home sign, with a two-cell placard of counts beneath it, each cell under a white-25% hairline.

### Motion
One system, GSAP with ScrollTrigger, in components/motion/line-motion.tsx. Transforms and opacity only.
- **Wake:** on load, the strip lines scale in on the X axis from the inline-start edge, 0.9s `expo.out`, staggered 0.09s, after 0.15s.
- **Lane draw and bend:** as items enter (`ScrollTrigger.batch`, start at 88% of the viewport, once, at most 3 items per batch, 0.15s batching interval), each item draws in three beats: its lane scales in on Y from the top (0.7s `expo.out`); at +0.22s the quarter-turn grows out of the lane (opacity 0 to 1, scale 0.3 to 1, origin at the lane corner, 0.3s `power2.out`); at +0.36s the run scales in on X from the lane (0.5s `expo.out`). Items in a batch are staggered 0.14s, so a fast scroll never sets the whole list moving at once.
- **Gate:** a blocking head script adds `.motion-ok` to `<html>` only when there is no reduced-motion preference. Only under that class do lines start unpainted; content is never hidden. A drawn line carries `data-drawn` and stays painted. Under reduced motion every line renders in place and nothing moves.

### Logo
The original AiPulse mark (components/brand/logo.tsx), inlined as SVG, viewBox 0 0 64 64:
- **Ring** (the daily scan): circle cx 30, cy 34, r 20.5, stroke 3.6, no fill, warm ivory #E8D9B5.
- **Centre dot** (the selected item): cx 30, cy 34, r 6.8, neon blue #2EA8FF.
- **Flagged dot** (the item the reader flagged): cx 47.5, cy 16.5, r 4.2, yellow #FFD300.

It always sits on the indigo top sign (#1A1544), in both themes, so its colours are fixed values, not theme tokens. At rest: ivory 12.2:1, blue 6.6:1, yellow 11.8:1 on indigo. Header lockup: the mark at 30px beside "AiPulse" in Rubik 800, 1.25rem. Home sign lockup: the mark at 48px (64px from 640px) beside the Display wordmark.

**Icons.** The favicon (public/favicon.svg, app/icon.png at 512px) and the manifest icons (public/icons/icon-192.png, icon-512.png) are the rest state on a #1A1544 tile (the top indigo, so the icon matches the header it comes from) with 14/64 rounded corners, the mark scaled 0.9 and centred on its bounding box, so it reads on any browser or home-screen background. app/apple-icon.png (180px) is the same tile full-bleed: iOS applies its own rounded mask and would fill transparent corners with black.

### Logo motion
The logo beat, GSAP, in components/motion/logo-motion.tsx. It runs on the header lockup, and on the home sign's lockup, which stands in for the header lockup on that page.
- **Sequence, about 2.2s:** (1) t=0, the centre dot beats once: scale 1 to 1.3 and back, 0.25s (`power2.out`, then `power2.in`). (2) From t=0.15s, four ripples leave the centre dot (r 6.8) for the ring (r 21) and fade (0.8s, `power1.out`: opacity 0 to 0.95 in the first 0.06s, then out to 0, so a waiting ripple is never visible), one every 0.28s, with a 2px stroke that does not scale with the mark (`vector-effect: non-scaling-stroke`), in the category colours in lane order, dark values as on the navy sign: R&D #0098D4, health services #00A33C, regulation #DC241F, infrastructure #FFD300. (3) As each ripple reaches the ring, 0.6s into it, the ring takes its colour (0.15s); after the last one it settles back to ivory (0.5s, `power1.inOut`), so it never rests on a category colour. (4) The flagged dot is hidden (scale 0) from t=0 and pops in over the settle (scale 0 to 1, 0.4s, `back.out(2.2)`).
- **Contrast in motion:** every ripple colour clears 3:1 on indigo: R&D blue 5.2, health green 5.1, regulation red 3.5, infrastructure yellow 11.8. The ring passes through them and rests on ivory (12.2).
- **When:** once on page load (after 0.35s), and again on hover (`pointerenter`) or tap (`pointerdown`). Never stacked: a trigger while it is running is ignored. No loop.
- **Rest state:** the markup is the rest state, and the ripples ship at opacity 0. Without JavaScript or under reduced motion (`gsap.matchMedia`: nothing is created) the mark is static: ivory ring, blue centre, yellow flagged dot. Under `.motion-ok` the flagged dot starts at opacity 0 so it does not flash before the first play; GSAP sets `data-shown` on it when it takes over, which lifts that gate for good.
- **Markup contract:** `<Logo>` renders `[data-logo-ripple]` ×4 (in category order, each stroked in its colour), `[data-logo-ring]`, `[data-logo-core]` and `[data-logo-flag]`, in that paint order; `<LogoMotion>` wraps the mark and the wordmark, and the whole lockup is the hover and tap target.

## Do's and Don'ts

### Do:
- **Do** set every item's `--line` from its category token (its first categorized topic) and paint its lane, bend, run, swatch and hover underline from that one variable.
- **Do** pair solid line + filled dot for primary sources and dashed line + hollow dot for secondary reporting, with the matching screen-reader text.
- **Do** use navy (sign) for every pressed, selected, pinned or boosted state.
- **Do** keep corners at 0px and lines on the 4px module.
- **Do** define every colour on `:root` in its dark value and override only in `:root[data-theme="light"]`.
- **Do** set dates and counts in Rubik with tabular numerals, bidi-isolated.
- **Do** animate only decorative lines, only with transforms, only under `.motion-ok`, and only through GSAP.
- **Do** use logical properties exclusively, and keep touch targets at 44px on a phone.

### Don't:
- **Don't** use a category colour as a general accent, link, button or state colour, or to mark a source family.
- **Don't** give a single topic its own colour; topics join a category.
- **Don't** add shadows or rounded corners; the dot and the logo are the only circles, and the icon tile is the only rounded corner.
- **Don't** let the logo ring rest on a category colour; it always settles to ivory.
- **Don't** read `prefers-color-scheme` or make light the fallback.
- **Don't** hide content behind motion or add a second animation library or effect.
- **Don't** put `direction: ltr` on a positioned element; its `inset-inline-*` will flip.
- **Don't** box items into cards; they stand on the floor, on their line.
- **Don't** remove or soften the footer disclosure line.
