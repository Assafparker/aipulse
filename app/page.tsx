import Link from "next/link";
import { HeroGraphic } from "@/components/brand/hero-graphic";
import { Logo } from "@/components/brand/logo";
import { ItemCard } from "@/components/feed/item-card";
import { FAMILIES } from "@/lib/constants";
import { ITEMS, LAST_SCAN, RECENT } from "@/lib/content";
import { itemCount } from "@/lib/format";

/**
 * The landing page. A server component throughout — nothing here is
 * interactive beyond navigation.
 *
 * Every number is computed from the content. A family carrying a `gap` is
 * not something that can be scanned at all, so it is excluded from the
 * count of scanned families, per SPEC.md 3.2. Claiming eight would overstate
 * what the scan actually covers.
 */

const SCANNED_FAMILIES = FAMILIES.filter((f) => !f.gap);

const PRINCIPLES = [
  {
    title: "מקור ראשוני קודם לדיווח עליו",
    body: "כשעיתונות מקצועית מדווחת על מחקר, הקישור כאן הוא למאמר עצמו ולא לכתבה. עיגול מלא מסמן מקור ראשוני, עיגול חלול מסמן דיווח משני.",
  },
  {
    title: "הסייג הוא חלק מהידיעה",
    body: "כל תקציר של מחקר נושא את עיצוב המחקר, את ה-n, ואת המגבלה שהמחברים עצמם הצהירו עליה. מאמר דעה מסומן במפורש כטיעון ולא כראיה.",
  },
  {
    title: "הקורא מסנן לעצמו",
    body: "משפחות מקור ונושאים ניתנים לכיבוי ולהדגשה, וכל אחד מסמן לעצמו מה כבר קרא ומה לשמור. הסימון נשאר בדפדפן שלך בלבד.",
  },
];

export default function Home() {
  const latest = ITEMS.slice(0, 4);

  return (
    <main>
      {/* 1 — Hero. The dot field is sparse on the right; in RTL the headline
          starts there, so the two do not collide. */}
      <section className="relative isolate overflow-hidden">
        <HeroGraphic className="pointer-events-none absolute inset-0 size-full opacity-70" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="max-w-xl">
            <Logo size={52} />
            <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
              AiPulse
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              סריקה יומית של AI בבריאות — מעבדות חזית, כתבי עת שפוטים,
              פרה-פרינטים ורגולטורים, בעברית, עם המספרים, הסייג, וקישור למקור
              הראשוני.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/feed"
                className="rounded-md bg-accent px-5 py-2.5 font-medium text-surface hover:opacity-90"
              >
                לפיד
              </Link>
              <Link
                href="/about"
                className="rounded-md border border-line-2 bg-surface px-5 py-2.5 font-medium hover:border-ink-3"
              >
                איך זה עובד
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — An honest count, computed from the content */}
      <section className="border-y border-line bg-surface-2">
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-3">
          {/* A <dl> may only contain dt, dd, div, script and template — a
              stray <p> inside the wrapper fails the definition-list rule, so
              the sub-note lives inside the <dd>. */}
          <div>
            <dt className="text-sm text-ink-3">פריטים בארכיון</dt>
            <dd className="mt-1">
              <span className="tnum text-3xl text-accent">{ITEMS.length}</span>
              <span className="mt-1 block text-xs text-ink-3">
                מתוכם {RECENT.length} ב-30 הימים האחרונים
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-3">משפחות מקור נסרקות</dt>
            <dd className="mt-1">
              <span className="tnum text-3xl text-accent">
                {SCANNED_FAMILIES.length}
              </span>
              <span className="mt-1 block text-xs text-ink-3">
                רשתות חברתיות אינן נסרקות כלל
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-3">הסריקה האחרונה</dt>
            <dd className="mt-1">
              <time
                dateTime={LAST_SCAN}
                className="tnum ltr block text-3xl text-accent"
              >
                {LAST_SCAN}
              </time>
              <span className="mt-1 block text-xs text-ink-3">
                מתעדכן כל בוקר
              </span>
            </dd>
          </div>
        </dl>
      </section>

      {/* 3 — Live preview: the four newest items, as real cards */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold">מה נכנס היום</h2>
          <Link href="/feed" className="text-sm text-accent hover:underline">
            כל הפיד ({itemCount(RECENT.length)}) ←
          </Link>
        </div>
        <ol className="mt-6 flex flex-col gap-4">
          {latest.map((item) => (
            <li key={item.id}>
              <ItemCard item={item} isNew={item.added === LAST_SCAN} />
            </li>
          ))}
        </ol>
      </section>

      {/* 4 — How the scan works */}
      <section className="border-t border-line bg-surface-2">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-2xl font-bold">שיטת העבודה</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title}>
                <span className="tnum text-sm text-accent">0{i + 1}</span>
                <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 font-light leading-relaxed text-ink-2">
                  {p.body}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm">
            <Link href="/about" className="text-accent hover:underline">
              מה בדיוק נסרק, ומה לא ←
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
