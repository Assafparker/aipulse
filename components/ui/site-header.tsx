import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "./theme-toggle";

/**
 * The site header, on every page.
 *
 * This is where the archive becomes reachable. SPEC.md 3.4 treats the
 * archive as an asset that grows forever and as the main source of search
 * traffic, but nothing in the UI linked to it — and /about and the month
 * pages had no way back at all. A persistent header fixes that in one place
 * and gives the theme toggle a consistent home on every route.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 hover:text-accent"
          aria-label="AiPulse — לעמוד הבית"
        >
          <Logo size={26} />
          <span className="text-lg font-black tracking-tight">AiPulse</span>
        </Link>

        <nav aria-label="ניווט ראשי" className="grow">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
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
            <li>
              <Link href="/about" className="text-ink-2 hover:text-ink hover:underline">
                השיטה
              </Link>
            </li>
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
