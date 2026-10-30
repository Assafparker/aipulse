import type { Metadata } from "next";
import Link from "next/link";
import { ArrowStart } from "@/components/ui/arrow";
import { ITEMS, MONTHS, byMonth } from "@/lib/content";
import { itemCount, monthLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "הארכיון — AiPulse",
  description:
    "כל ההיסטוריה של הסריקה היומית של AI בבריאות, מסודרת לפי חודשים. שום פריט לא נמחק.",
};

/**
 * Month index, newest first, set as the building directory in the lobby:
 * every month is a floor. The archive accumulates — see SPEC.md 3.4.
 */
export default function ArchivePage() {
  const months = MONTHS.map((month) => ({
    month,
    count: byMonth(month).length,
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="max-w-4xl">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em]">
            הארכיון
          </h1>
          <p className="mt-3 font-display text-[0.9375rem] text-ink-2">
            <span className="tnum font-semibold text-ink">{ITEMS.length}</span> פריטים ב-
            <span className="tnum font-semibold text-ink">{MONTHS.length}</span> חודשים. שום
            פריט לא נמחק.
          </p>
        </div>
        <Link
          href="/feed"
          className="inline-flex min-h-11 sm:min-h-10 items-center gap-2 font-display text-[0.9375rem] font-semibold text-ink underline"
        >
          חזרה לפיד
          <ArrowStart />
        </Link>
      </header>

      <ul className="on-sign bg-sign p-2 text-sign-ink sm:p-3">
        {months.map(({ month, count }) => (
          <li key={month} className="border-b border-sign-ink/15 last:border-b-0">
            <Link
              href={`/archive/${month}`}
              className="group flex min-h-16 items-center gap-4 px-3 transition-colors hover:bg-sign-2 sm:px-5"
            >
              <span className="grow font-display text-xl font-semibold sm:text-2xl">
                {monthLabel(month)}
              </span>
              <span className="tnum text-[0.9375rem] text-sign-ink-2">
                {itemCount(count)}
              </span>
              <span className="text-sign-ink-2 transition-transform group-hover:-translate-x-1 group-hover:text-sign-ink">
                <ArrowStart />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </main>
  );
}
