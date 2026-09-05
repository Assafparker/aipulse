import Link from "next/link";

/**
 * The footer, on every page.
 *
 * The disclosure line is a requirement, not decoration (CLAUDE.md rule 8,
 * SPEC.md 6). It comes first, above the secondary links, so it is never
 * pushed below them. Do not remove it and do not soften its wording: the
 * readers here make professional decisions, so where the text comes from
 * is stated openly rather than buried.
 */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="max-w-prose text-sm text-ink-3">
          התקצירים באתר מופקים בסריקה יומית אוטומטית ומקושרים למקור הראשוני.
          המקור הוא הקובע.
        </p>
        <nav aria-label="קישורים בתחתית העמוד" className="mt-4">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <Link href="/about" className="text-accent hover:underline">
                שיטת העבודה
              </Link>
            </li>
            <li>
              <Link href="/feed" className="text-ink-2 hover:text-ink hover:underline">
                הפיד
              </Link>
            </li>
            <li>
              <Link href="/archive" className="text-ink-2 hover:text-ink hover:underline">
                הארכיון
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
