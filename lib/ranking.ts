import type { Item } from "./schema";
import type { UserState } from "./user-state";

/**
 * Ranking, per SPEC.md 5.
 *
 * A topic marked "more" adds 1, "less" subtracts 1, and an item's score is
 * the sum over its own topics. A negative score dims the item — it is never
 * hidden. Only the reader turning off a source family, or marking an item
 * read, removes anything from the feed.
 */

export const scoreOf = (i: Item, prefs: UserState["prefs"]) =>
  i.topics.reduce((s, t) => s + (prefs[t] ?? 0), 0);

/** Negative score means dimmed to opacity .6, still present and still linked. */
export const isDimmed = (i: Item, prefs: UserState["prefs"]) =>
  scoreOf(i, prefs) < 0;

/**
 * "date" sorts newest first. "pref" sorts by score descending and breaks
 * ties by date descending, so preferences reorder the feed without ever
 * discarding the recency signal.
 */
export function sortItems(
  items: Item[],
  sort: UserState["sort"],
  prefs: UserState["prefs"],
): Item[] {
  const out = [...items];

  if (sort === "date") {
    out.sort((a, b) => b.date.localeCompare(a.date));
    return out;
  }

  out.sort((a, b) => {
    const byScore = scoreOf(b, prefs) - scoreOf(a, prefs);
    return byScore !== 0 ? byScore : b.date.localeCompare(a.date);
  });
  return out;
}
