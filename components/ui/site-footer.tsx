import Link from "next/link";

/**
 * The footer, on every page: where the corridor ends.
 *
 * The disclosure line is a requirement, not decoration (CLAUDE.md rule 8,
 * SPEC.md 6). It comes first, above the secondary links, so it is never
 * pushed below them. Do not remove it and do not soften its wording: the
 * readers here make professional decisions, so where the text comes from
 * is stated openly rather than buried.
 */
export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-4 border-sign bg-floor-2">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="max-w-prose text-base leading-relaxed text-ink">
          התקצירים באתר מופקים בסריקה יומית אוטומטית ומקושרים למקור הראשוני.
          המקור הוא הקובע.
        </p>
        <nav aria-label="קישורים בתחתית העמוד" className="mt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 font-display text-[0.9375rem] font-medium">
            <li>
              <Link href="/about" className="inline-flex min-h-11 sm:min-h-10 items-center text-ink underline">
                שיטת העבודה
              </Link>
            </li>
            <li>
              <Link href="/feed" className="inline-flex min-h-11 sm:min-h-10 items-center text-ink-2 hover:text-ink hover:underline">
                הפיד
              </Link>
            </li>
            <li>
              <Link href="/archive" className="inline-flex min-h-11 sm:min-h-10 items-center text-ink-2 hover:text-ink hover:underline">
                הארכיון
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
