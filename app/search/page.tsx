import type { Metadata } from "next";
import Link from "next/link";
import { ItemCard } from "@/components/feed/item-card";
import { LineMotion } from "@/components/motion/line-motion";
import { SearchBox } from "@/components/ui/search-box";
import { ITEMS } from "@/lib/content";
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
    <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="max-w-4xl">
      <header className="mb-8 border-b-2 border-ink pb-5">
        <p>
          <Link
            href="/feed"
            className="inline-flex min-h-11 sm:min-h-10 items-center font-display text-[0.9375rem] font-semibold text-ink underline"
          >
            חזרה לפיד
          </Link>
        </p>
        <h1 className="mt-1 text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">
          חיפוש
        </h1>
        <div className="mt-5">
          <SearchBox defaultValue={q} />
        </div>
        {q ? (
          <p className="mt-3 text-[0.9375rem] text-ink-2">
            <span className="tnum font-semibold text-ink">{itemCount(results.length)}</span>{" "}
            נמצאו עבור <bdi className="font-semibold text-ink">&quot;{q}&quot;</bdi>
          </p>
        ) : (
          <p className="mt-3 text-[0.9375rem] text-ink-2">הקלד מונח לחיפוש בכל הארכיון.</p>
        )}
      </header>

      {q && results.length === 0 ? (
        <p className="border border-dashed border-ink-3 p-6 text-ink-2">
          אין תוצאות. נסה מונח אחר.
        </p>
      ) : null}

      {results.length > 0 ? (
        <>
          {/* Cards use <h3>; without this the order jumps h1 to h3. */}
          <h2 className="sr-only">תוצאות החיפוש</h2>
          <LineMotion>
            <ol>
              {results.map((item) => (
                <li key={item.id}>
                  <ItemCard item={item} />
                </li>
              ))}
            </ol>
          </LineMotion>
        </>
      ) : null}
      </div>
    </main>
  );
}
