import raw from "@/content/items.json";
import { ItemsSchema, type Item } from "./schema";

// Validation runs at module load, which means at build time. This is
// deliberate: a scan that wrote malformed JSON fails the Vercel deploy
// instead of publishing a broken page, and the previous build stays live.
const parsed = ItemsSchema.safeParse(raw);
if (!parsed.success) {
  throw new Error("content/items.json לא תקין:\n" + JSON.stringify(parsed.error.format(), null, 2));
}

export const ITEMS: Item[] = [...parsed.data].sort((a, b) => b.date.localeCompare(a.date));
export const LAST_SCAN: string = ITEMS.reduce((m, i) => (i.added > m ? i.added : m), "0000-00-00");

const DAY = 86_400_000;
const cutoff = new Date(Date.now() - 30 * DAY).toISOString().slice(0, 10);

/**
 * The feed shows the last 30 days; the archive holds everything. Nothing is
 * ever deleted — see SPEC.md 3.4. The whole set ships in one payload today
 * and that is fine at this size. Past roughly 500 items, split it: /feed and
 * /archive/[month] are already served separately, and /saved should then pull
 * a trimmed index (id, title, date, src, url — no summary) instead of the
 * full set. Do not build that ahead of time.
 */
export const RECENT: Item[] = ITEMS.filter(i => i.date >= cutoff);
export const MONTHS: string[] = [...new Set(ITEMS.map(i => i.date.slice(0, 7)))].sort().reverse();
export const byMonth = (m: string) => ITEMS.filter(i => i.date.startsWith(m));

/**
 * The homepage list, built from `added` (the day the scan put an item on the
 * site), not `date` (the day the source published it). Items typically enter
 * days or weeks after publication, so sorting by `date` buries today's intake.
 *
 * Everything from the latest scan, backfilled from earlier scans up to `min`
 * when the latest is thin, capped at `max`. Ordered added desc, then date desc.
 */
export function latestAdded(items: Item[], min = 4, max = 8): Item[] {
  const sorted = [...items].sort(
    (a, b) => b.added.localeCompare(a.added) || b.date.localeCompare(a.date),
  );
  const last = sorted[0]?.added;
  const fromLast = sorted.filter((i) => i.added === last).length;
  return sorted.slice(0, Math.min(max, Math.max(min, fromLast)));
}

export const LATEST: Item[] = latestAdded(ITEMS);

/** Today's date in Israel, as YYYY-MM-DD. Evaluated at build time. */
export function todayInJerusalem(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** True when the latest scan ran today, Israel time. */
export const LAST_SCAN_IS_TODAY: boolean = LAST_SCAN === todayInJerusalem();
