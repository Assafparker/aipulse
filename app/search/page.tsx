import type { Metadata } from "next";
import Link from "next/link";
import { ItemCard } from "@/components/feed/item-card";
import { SearchBox } from "@/components/ui/search-box";
import { ITEMS, LAST_SCAN } from "@/lib/content";
import { itemCount } from "@/lib/format";
import { searchItems } from "@/lib/search";

/**
 * Search across the whole archive, not just the 30-day feed.
 *
 * On Next 16 `searchParams` is a Promise and must be awaited — in the page
 * and in generateMetadata alike. A repeated `?q=` arrives as an array; the
 * first value wins.
 */

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function queryOf(searchParams: Props["searchParams"]): Promise<string> {
  const { q } = await searchParams;
  return (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = await queryOf(searchParams);
  return { title: q ? `"${q}" — חיפוש AiPulse` : "חיפוש — AiPulse" };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = await queryOf(searchParams);
  const results = searchItems(ITEMS, q);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <p className="text-sm">
          <Link href="/feed" className="text-accent hover:underline">
            חזרה לפיד
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-bold">חיפוש</h1>
        <div className="mt-4">
          <SearchBox defaultValue={q} />
        </div>
        {q ? (
          <p className="mt-3 text-sm text-ink-3">
            <span className="tnum text-ink-2">{itemCount(results.length)}</span>{" "}
            נמצאו עבור <bdi className="text-ink-2">&quot;{q}&quot;</bdi>
          </p>
        ) : (
          <p className="mt-3 text-sm text-ink-3">הקלד מונח לחיפוש בכל הארכיון.</p>
        )}
      </header>

      {q && results.length === 0 ? (
        <p className="rounded-lg border border-line bg-surface p-6 text-ink-3">
          אין תוצאות. נסה מונח אחר.
        </p>
      ) : null}

      {results.length > 0 ? (
        <>
          {/* Cards use <h3>; without this the order jumps h1 to h3. */}
          <h2 className="sr-only">תוצאות החיפוש</h2>
          <ol className="flex flex-col gap-4">
            {results.map((item) => (
              <li key={item.id}>
                <ItemCard item={item} isNew={item.added === LAST_SCAN} />
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </main>
  );
}
