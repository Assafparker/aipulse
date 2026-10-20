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
 * The homepage list: the items of the latest update, and only those. Built
 * from `added` (the day the scan put an item on the site), not `date` (the
 * day the source published it) — items typically enter days or weeks after
 * publication. Never padded from earlier updates, so dates are never mixed
 * under one heading.
 *
 * Pure: `today` (YYYY-MM-DD, Asia/Jerusalem) is passed in rather than read
 * from the clock, so the heading choice can be tested with any date.
 */
export type LatestUpdate = {
  /** The latest `added` date, i.e. LAST_SCAN for the full item set. */
  date: string;
  /** Whether that update ran on `today`. Picks the homepage heading. */
  isToday: boolean;
  /** Items from that update, date desc, capped at `max`. */
  items: Item[];
  /** How many items that update added in all, before the cap. */
  total: number;
};

export function latestAdded(items: Item[], today: string, max = 8): LatestUpdate {
  const date = items.reduce((m, i) => (i.added > m ? i.added : m), "0000-00-00");
  const fromLatest = items
    .filter((i) => i.added === date)
    .sort((a, b) => b.date.localeCompare(a.date));
  return {
    date,
    isToday: date === today,
    items: fromLatest.slice(0, max),
    total: fromLatest.length,
  };
}

/** Today's date in Israel, as YYYY-MM-DD. */
export function todayInJerusalem(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
