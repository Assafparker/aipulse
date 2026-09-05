import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ITEMS, RECENT, MONTHS, LAST_SCAN } from "@/lib/content";
import { FAMILIES } from "@/lib/constants";

/**
 * Temporary home page — stages 0 and 1 only.
 * It exists to prove the skeleton stands: Hebrew right-to-left, the three
 * fonts, the palette following the system theme, and the content layer
 * validating and loading. Stage 4 replaces it with the real landing page.
 *
 * The counters below are computed from the content, never typed by hand.
 */

const SWATCHES = [
  { token: "--ground", label: "רקע" },
  { token: "--surface", label: "משטח" },
  { token: "--accent", label: "מבטא" },
  { token: "--accent-soft", label: "מבטא רך" },
  { token: "--pin", label: "הצמדה" },
  { token: "--line", label: "קו" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-12 px-6 py-16">
      <header className="flex items-center gap-4">
        <Logo size={56} />
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            AiPulse
          </h1>
          <p className="mt-1 text-ink-2">סריקה יומית של AI בבריאות</p>
        </div>
      </header>

      <nav className="flex gap-3">
        <Link
          href="/feed"
          className="rounded-md bg-accent px-4 py-2 text-surface hover:opacity-90"
        >
          לפיד
        </Link>
        <Link
          href="/archive"
          className="rounded-md border border-line px-4 py-2 hover:border-line-2"
        >
          לארכיון
        </Link>
      </nav>

      <section className="rounded-lg border border-line bg-surface p-6">
        <h2 className="text-xl">בדיקת שלד</h2>
        <p className="mt-3 max-w-prose font-light leading-relaxed text-ink-2">
          הפסקה הזאת ב-Heebo, הכותרות ב-Frank Ruhl Libre, והמספרים והתוויות
          ב-IBM Plex Mono. הטקסט זורם מימין לשמאל, ומונחים לטיניים כמו{" "}
          <span className="ltr">AUROC</span> ו-<span className="ltr">LLM</span>{" "}
          משובצים בתוכו בלי לשבור את הכיוון.
        </p>
      </section>

      <section className="rounded-lg border border-line bg-surface p-6">
        <h2 className="text-xl">שכבת התוכן</h2>
        <p className="mt-2 text-sm text-ink-3">
          המספרים האלה מחושבים מ-<span className="ltr">content/items.json</span>{" "}
          אחרי ולידציה, ולא מוקלדים.
        </p>
        <dl className="tnum mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "פריטים בסך הכול", value: ITEMS.length },
            { label: "בחלון 30 הימים", value: RECENT.length },
            { label: "חודשים בארכיון", value: MONTHS.length },
            { label: "משפחות מקור", value: FAMILIES.length },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-ink-3">{label}</dt>
              <dd className="text-2xl text-accent">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-ink-3">
          סריקה אחרונה <time className="text-ink-2">{LAST_SCAN}</time> · חודשים:{" "}
          <span className="tnum ltr text-ink-2">{MONTHS.join(" · ")}</span>
        </p>
      </section>

      <section>
        <h2 className="text-xl">הפלטה</h2>
        <p className="mt-2 text-sm text-ink-3">
          החלף את מצב מערכת ההפעלה בין בהיר לכהה — הערכים והרקע צריכים להתחלף.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SWATCHES.map(({ token, label }) => (
            <li
              key={token}
              className="flex items-center gap-3 rounded-md border border-line bg-surface p-3"
            >
              <span
                className="size-8 shrink-0 rounded border border-line-2"
                style={{ background: `var(${token})` }}
              />
              <span className="min-w-0">
                <span className="block text-sm">{label}</span>
                <span className="ltr tnum block truncate text-xs text-ink-3">
                  {token}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-line pt-6 text-sm text-ink-3">
        התקצירים באתר מופקים בסריקה יומית אוטומטית ומקושרים למקור הראשוני. המקור
        הוא הקובע.
      </footer>
    </main>
  );
}
