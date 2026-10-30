import Link from "next/link";
import { LineLegend, LineStrip } from "@/components/brand/line-legend";
import { ItemCard } from "@/components/feed/item-card";
import { LineMotion } from "@/components/motion/line-motion";
import { WordmarkMotion } from "@/components/motion/wordmark-motion";
import { ArrowStart } from "@/components/ui/arrow";
import { FAMILIES } from "@/lib/constants";
import {
  ITEMS,
  LAST_SCAN,
  RECENT,
  latestAdded,
  todayInJerusalem,
} from "@/lib/content";
import { itemCount } from "@/lib/format";

/**
 * The landing page. A server component throughout — nothing here is
 * interactive beyond navigation (the line motion is a decorative client
 * wrapper).
 *
 * Every number is computed from the content. A family carrying a `gap` is
 * not something that can be scanned at all, so it is excluded from the
 * count of scanned families, per SPEC.md 3.2.
 */

/**
 * Static, but regenerated at most hourly. The "today" heading depends on the
 * clock, not just the content: without this, a page built yesterday would go
 * on saying "today" about yesterday's items until the next deploy.
 */
export const revalidate = 3600;

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
  // Inside the render, not at module scope: a module-level value is computed
  // once per server process and would survive every revalidation.
  const latest = latestAdded(ITEMS, todayInJerusalem());

  return (
    <main>
      {/* 1 — The department sign. The brand and its promise at the start,
          the directory of honest counts at the end. */}
      <section className="home-sign on-sign border-b border-sign-ink/25 bg-sign text-sign-ink">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-6 pt-5 sm:gap-10 sm:px-6 sm:pb-12 sm:pt-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            {/* On home the header lockup steps aside and this one stands in
                for it, with a motion of its own. */}
            <WordmarkMotion />
            <p className="mt-4 max-w-[38ch] text-[1.0625rem] leading-relaxed text-sign-ink-2 sm:mt-6 sm:text-xl">
              סריקה יומית של AI בבריאות — מעבדות חזית, כתבי עת שפוטים,
              פרה-פרינטים ורגולטורים, בעברית, עם המספרים, הסייג, וקישור למקור
              הראשוני.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <Link
                href="/feed"
                className="inline-flex min-h-12 items-center gap-3 bg-sign-ink px-6 font-display text-base font-semibold text-sign transition-colors hover:bg-sign-ink-2"
              >
                לפיד
                <ArrowStart />
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-12 items-center border border-sign-ink/40 px-6 font-display text-base font-medium text-sign-ink transition-colors hover:border-sign-ink hover:bg-sign-2"
              >
                איך זה עובד
              </Link>
            </div>
          </div>

          {/* The room plate: the last scan's date is the sign's number, with
              the two counts as a small placard beneath it. A <dl> may only
              contain dt, dd and div, so each sub-note lives inside its <dd>. */}
          <dl className="grid grid-cols-2 gap-x-6 font-display lg:justify-self-end">
            <div className="col-span-2 mb-4 flex flex-wrap items-end gap-x-4 gap-y-1">
              <dt className="order-2 text-sm text-sign-ink-2 sm:text-[0.9375rem]">
                הסריקה האחרונה
                <span className="block text-xs">מתעדכן כל בוקר</span>
              </dt>
              <dd className="order-1">
                <time
                  dateTime={LAST_SCAN}
                  className="ltr block border-2 border-sign-ink px-3 py-1 text-[clamp(1.75rem,6vw,3.25rem)] font-bold leading-none tracking-[-0.02em]"
                >
                  {LAST_SCAN}
                </time>
              </dd>
            </div>
            <div className="border-t border-sign-ink/25 pt-3">
              <dt className="text-xs text-sign-ink-2 sm:text-sm">פריטים בארכיון</dt>
              <dd>
                <span className="tnum text-lg font-semibold">{ITEMS.length}</span>
                <span className="block text-xs leading-snug text-sign-ink-2">
                  מתוכם {RECENT.length} ב-30 הימים האחרונים
                </span>
              </dd>
            </div>
            <div className="border-t border-sign-ink/25 pt-3">
              <dt className="text-xs text-sign-ink-2 sm:text-sm">משפחות מקור נסרקות</dt>
              <dd>
                <span className="tnum text-lg font-semibold">
                  {SCANNED_FAMILIES.length}
                </span>
                <span className="block text-xs leading-snug text-sign-ink-2">
                  רשתות חברתיות אינן נסרקות כלל
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <LineMotion className="flex flex-col">
        {/* 2 — On the landing page the lines leave from under the big sign
            (the header's own strip is hidden here), then the key names each
            one: the colour code every row below is set on. */}
        <LineStrip />
        {/* On a phone the key follows the list, so today's headlines reach
            the first screen; from sm up it sits right under the lines. */}
        <section aria-label="מקרא הקווים" className="order-last mt-14 bg-floor-2 sm:order-none sm:mt-0">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
            <LineLegend />
          </div>
        </section>

        {/* 3 — Live preview: what the latest scan added, as real rows */}
        <section className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-12">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b-2 border-ink pb-2 sm:gap-y-3 sm:pb-4">
            <h2 className="text-[clamp(1.4rem,4vw,2.5rem)] font-bold leading-tight tracking-[-0.02em]">
              {latest.isToday ? (
                "מה נכנס היום"
              ) : (
                <>
                  מה נכנס בעדכון האחרון{" "}
                  <time dateTime={latest.date} className="ltr inline-block align-middle text-[0.5em] font-semibold text-ink-2">
                    {latest.date}
                  </time>
                </>
              )}
            </h2>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              {latest.total > latest.items.length && (
                <span className="text-sm text-ink-3">
                  מוצגים {latest.items.length} מתוך {itemCount(latest.total)} שנכנסו
                  בעדכון
                </span>
              )}
              <Link
                href="/feed"
                className="inline-flex min-h-11 sm:min-h-10 items-center gap-2 font-display text-[0.9375rem] font-semibold text-ink hover:underline"
              >
                כל הפיד ({itemCount(RECENT.length)})
                <ArrowStart />
              </Link>
            </div>
          </div>
          <ol>
            {latest.items.map((item) => (
              <li key={item.id}>
                <ItemCard item={item} />
              </li>
            ))}
          </ol>
        </section>
      </LineMotion>

      {/* 4 — How the scan works */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <h2 className="text-[clamp(1.625rem,4vw,2.5rem)] font-bold tracking-[-0.02em]">
          שיטת העבודה
        </h2>
        <ul className="mt-8 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="border-t-4 border-sign-line pt-5">
              <h3 className="text-xl font-semibold leading-snug">{p.title}</h3>
              <p className="mt-3 leading-[1.7] text-ink-2">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link
            href="/about"
            className="inline-flex min-h-11 sm:min-h-10 items-center gap-2 font-display text-[0.9375rem] font-semibold text-ink underline"
          >
            מה בדיוק נסרק, ומה לא
            <ArrowStart />
          </Link>
        </p>
      </section>
    </main>
  );
}
