import type { Metadata } from "next";
import Link from "next/link";
import { ITEMS, MONTHS, byMonth } from "@/lib/content";
import { itemCount, monthLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "הארכיון — AiPulse",
  description:
    "כל ההיסטוריה של הסריקה היומית של AI בבריאות, מסודרת לפי חודשים. שום פריט לא נמחק.",
};

/** Month index, newest first. The archive accumulates — see SPEC.md 3.4. */
export default function ArchivePage() {
  const months = MONTHS.map((month) => ({
    month,
    count: byMonth(month).length,
  }));

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">הארכיון</h1>
        <p className="mt-2 text-sm text-ink-3">
          <span className="tnum text-ink-2">{ITEMS.length}</span> פריטים ב-
          <span className="tnum text-ink-2">{MONTHS.length}</span> חודשים. שום
          פריט לא נמחק.
        </p>
        <p className="mt-2 text-sm">
          <Link href="/feed" className="text-accent hover:underline">
            חזרה לפיד
          </Link>
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {months.map(({ month, count }) => (
          <li key={month}>
            <Link
              href={`/archive/${month}`}
              className="flex items-center justify-between rounded-lg border border-line bg-surface p-4 hover:border-line-2"
            >
              <span className="text-lg">{monthLabel(month)}</span>
              <span className="tnum text-sm text-ink-3">{itemCount(count)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
