import type { Metadata } from "next";
import Link from "next/link";
import { FeedList } from "@/components/feed/feed-list";
import { ArrowStart } from "@/components/ui/arrow";
import { LAST_SCAN, RECENT } from "@/lib/content";
import { itemCount } from "@/lib/format";

export const metadata: Metadata = {
  title: "הפיד — AiPulse",
  description:
    "30 הימים האחרונים בסריקה היומית של AI בבריאות, מהחדש לישן, עם קישור למקור הראשוני.",
};

/**
 * Server component. It hands RECENT to the client FeedList, so the items are
 * in the initial HTML rather than fetched after hydration.
 */
export default function FeedPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em]">
            הפיד
          </h1>
          <p className="mt-3 font-display text-[0.9375rem] text-ink-2">
            30 הימים האחרונים · <span className="tnum">{itemCount(RECENT.length)}</span> ·
            סריקה אחרונה{" "}
            <time dateTime={LAST_SCAN} className="ltr font-semibold text-ink">
              {LAST_SCAN}
            </time>
          </p>
        </div>
        <Link
          href="/archive"
          className="inline-flex min-h-11 sm:min-h-10 items-center gap-2 font-display text-[0.9375rem] font-semibold text-ink underline"
        >
          לארכיון המלא
          <ArrowStart />
        </Link>
      </header>

      <FeedList items={RECENT} />
    </main>
  );
}
