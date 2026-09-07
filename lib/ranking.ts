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
 * "added" sorts by the date the scan added the item, newest first, and is
 * the default. "date" sorts by the publish date, newest first. "pref" sorts
 * by score descending. Both "added" and "pref" break ties by publish date
 * descending, so neither one discards the recency signal.
 */
export function sortItems(
  items: Item[],
  sort: UserState["sort"],
  prefs: UserState["prefs"],
): Item[] {
  const out = [...items];

  // "added" is the default: it answers "what is new here?", which is not the
  // same question as "what was published most recently". A whole scan run
  // shares one added value, so publish date orders each batch internally.
  if (sort === "added") {
    out.sort((a, b) => {
      const byAdded = b.added.localeCompare(a.added);
      return byAdded !== 0 ? byAdded : b.date.localeCompare(a.date);
    });
    return out;
  }

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
