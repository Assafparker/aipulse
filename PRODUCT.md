# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hebrew-speaking health professionals: clinicians, health-policy people, researchers, and digital-health product people. They already know what AUROC is and need no explanation of what an LLM is, but they have no time to read twenty sources a day. The primary situation is a quick morning scan, mostly on a phone: land, scan the headlines, open the one or two items worth reading at the source, mark the rest read, and come back tomorrow to see only what is new.

## Product Purpose

AiPulse is a daily Hebrew digest of AI-in-healthcare news and research. Each morning a scan reads primary sources (frontier labs, peer-reviewed journals, preprints, regulators, hospitals, professional press) and selects roughly 8 to 14 items. Each item is written in Hebrew with the real numbers **and the caveat**, and links to the primary source.

Success (PRD §7): a first-time visitor understands what this is within ten seconds, scrolls into the feed, marks two items read and one saved, and returns the next day to see only what they have not seen.

## Positioning

It is not a headline aggregator:

- **Primary source before coverage of it.** When press reports on a study, the link goes to the paper, not the article.
- **The caveat is part of the news.** Every research summary carries the study design, the n, and the limitation the authors declared. Opinion pieces are marked as argument, not evidence.
- **The reader filters for themselves.** Source families and topics can be switched off or boosted, and each reader marks what they have read, saved, or pinned.

## Operating Context

- A cloud scheduled scan writes `content/items.json` daily (git clone, scan, commit, push, Vercel deploy). **In this redesign sandbox the remote is removed and no scan or deploy runs.** Existing items are the only content.
- Routes: `/` landing, `/feed` (last 30 days), `/archive` and `/archive/[month]` (full history, never pruned), `/about` (method), `/search` (whole archive).
- Reader state (read, saved, pinned, topic prefs, family toggles, sort) lives in localStorage behind `lib/user-state.ts`. No accounts, ever.

## Capabilities and Constraints

- Next.js 16 App Router, TypeScript strict, Tailwind v4, Zod schema validated at build time. Server components by default.
- Hebrew only, `<html lang="he" dir="rtl">`, logical CSS properties only (no left/right).
- Each item: source family, source name, added date (`added`), publish date (`date`), 1 to 3 topic tags, linked title, optional source-language title, and summary. Filled dot means primary source; hollow means secondary reporting.
- Reader actions per item: pin, save, already read (with `aria-pressed`).
- Light and dark palettes with a manual toggle persisted in localStorage and replayed before first paint. Per the owner's answer during this redesign, the new direction decides which one is the default. The OS preference is still not consulted.
- No analytics additions, no cookie banner, no newsletter, no chatbot.

## Brand Commitments

- Name: **AiPulse**. Official subtitle: "סריקה יומית של AI בבריאות".
- For this redesign experiment the owner made the visual identity (mark, palette, typography) fully open to replacement. The name stays.
- Voice: precise, sober, professional Hebrew. Numbers and caveats are never softened.

## Evidence on Hand

- `content/items.json`: 299 real items with real links (108 in the last 30 days at the time of writing). Never add, edit, or invent items; for an empty state, filter the existing array.
- `content/people.json`, family and topic lists in `lib/constants.ts`.
- No testimonials, user counts, or press quotes exist; do not fabricate them.

## Product Principles

1. Headlines must scan in seconds; nothing decorative may slow the morning read.
2. Provenance is visible: source family, primary versus secondary, and both dates are always shown.
3. The disclosure ("התקצירים באתר מופקים בסריקה יומית אוטומטית ומקושרים למקור הראשוני. המקור הוא הקובע.") appears in every footer and on the method page. It is never removed or softened.
4. Nothing is ever deleted from the archive.
5. Reader state is private to the browser and never affects what others see.

## Accessibility & Inclusion

Full keyboard navigation, visible focus, WCAG AA contrast in both themes, `aria-pressed` on every state toggle, tabular numbers for dates and counts, and correct bidi isolation for embedded Latin strings and neutral-leading strings. Motion must respect `prefers-reduced-motion`.
