"use client";

import { ItemCard } from "./item-card";
import type { Item } from "@/lib/schema";

/**
 * The feed list.
 *
 * Client component, but it receives the items as a prop from the server page
 * rather than fetching them. That is what puts the full content into the
 * initial HTML, so the feed is server-rendered and search engines see it.
 *
 * Stage 2 renders a sorted list and nothing more. Filtering, topic
 * preferences, views and the pinned group arrive in stage 3.
 */

export function FeedList({
  items,
  lastScan,
}: {
  items: Item[];
  lastScan: string;
}) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <p className="rounded-lg border border-line bg-surface p-6 text-ink-3">
        אין פריטים להצגה.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-4">
      {sorted.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} isNew={item.added === lastScan} />
        </li>
      ))}
    </ol>
  );
}
