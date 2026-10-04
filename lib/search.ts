import type { Item } from "./schema";

/**
 * Site-wide search over the full archive.
 *
 * Plain in-memory substring matching: the set is small enough (see the note
 * in lib/content.ts) that an index library would cost more than it saves.
 * Every query term must appear somewhere in the item's text — AND across
 * terms, not an exact phrase — so "FDA אישור" finds an item where the two
 * words are far apart. Input order is kept, so ITEMS in means newest-first out.
 */

const haystack = (i: Item) =>
  `${i.title} ${i.titleSrc ?? ""} ${i.summary} ${i.src}`.toLowerCase();

/** A blank query returns nothing, not the whole archive. */
export function searchItems(items: Item[], query: string): Item[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (terms.length === 0) return [];

  return items.filter((i) => {
    const text = haystack(i);
    return terms.every((t) => text.includes(t));
  });
}
