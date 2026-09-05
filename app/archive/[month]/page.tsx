import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemCard } from "@/components/feed/item-card";
import { LAST_SCAN, MONTHS, byMonth } from "@/lib/content";
import { itemCount, monthLabel } from "@/lib/format";

/**
 * A single archive month.
 *
 * On Next 16 `params` is a Promise and must be awaited — in the page and in
 * generateMetadata alike. dynamicParams is off because the content set is
 * fully known at build time: a month that is not in MONTHS is a 404, not a
 * page to render on demand.
 *
 * The per-month metadata is the point of this route. SPEC.md 6 identifies it
 * as what brings search traffic, so each month carries its own title.
 */

export const dynamicParams = false;

type Params = { params: Promise<{ month: string }> };

export function generateStaticParams() {
  return MONTHS.map((month) => ({ month }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { month } = await params;
  const label = monthLabel(month);
  const count = byMonth(month).length;

  return {
    title: `${label} — ארכיון AiPulse`,
    description: `${itemCount(count)} מהסריקה היומית של AI בבריאות ב${label}, עם קישור למקור הראשוני של כל אחד.`,
  };
}

export default async function MonthPage({ params }: Params) {
  const { month } = await params;
  const items = byMonth(month);

  if (items.length === 0) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <p className="text-sm">
          <Link href="/archive" className="text-accent hover:underline">
            הארכיון
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-bold">{monthLabel(month)}</h1>
        <p className="tnum mt-2 text-sm text-ink-3">{itemCount(items.length)}</p>
      </header>

      {/* Cards use <h3>; without this the order jumps h1 to h3. */}
      <h2 className="sr-only">פריטי החודש</h2>
      <ol className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.id}>
            <ItemCard item={item} isNew={item.added === LAST_SCAN} />
          </li>
        ))}
      </ol>
    </main>
  );
}
