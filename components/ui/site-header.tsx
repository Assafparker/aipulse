import Link from "next/link";
import { LineStrip } from "@/components/brand/line-legend";
import { Logo } from "@/components/brand/logo";
import { LineMotion } from "@/components/motion/line-motion";
import { LogoMotion } from "@/components/motion/logo-motion";
import { MainNav } from "./main-nav";
import { SearchBox } from "./search-box";
import { ThemeToggle } from "./theme-toggle";

/**
 * The site header, on every page: an indigo department sign with the floor
 * lines leaving from under it.
 *
 * This is where the archive becomes reachable. SPEC.md 3.4 treats the
 * archive as an asset that grows forever and as the main source of search
 * traffic; a persistent header gives it, the method page and the theme toggle
 * one consistent home on every route.
 */

export function SiteHeader() {
  return (
    <header>
      <div className="header-sign on-sign border-b border-sign-ink/25 bg-top text-sign-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="header-brand flex min-h-11 items-center gap-2.5"
            aria-label="AiPulse — לעמוד הבית"
          >
            <LogoMotion className="flex items-center gap-2.5">
              <Logo size={30} />
              <span className="whitespace-nowrap font-display text-xl font-extrabold tracking-[-0.02em]">
                AiPulse
              </span>
            </LogoMotion>
          </Link>

          <nav aria-label="ניווט ראשי" className="header-nav order-3 w-full sm:order-none sm:w-auto sm:grow">
            <MainNav />
          </nav>

          <div className="ms-auto flex items-center gap-2 sm:ms-0">
            <div className="hidden md:block">
              <SearchBox variant="sign" />
            </div>
            <Link
              href="/search"
              aria-label="חיפוש בארכיון"
              className="grid size-11 place-items-center sm:size-10 border border-sign-ink/30 text-sign-ink transition-colors hover:border-sign-ink hover:bg-top-2 md:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="10.5" cy="10.5" r="6" />
                <path d="M15 15l5.5 5.5" />
              </svg>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
      {/* Hidden on the landing page, where the strip leaves from under the
          big sign instead (see globals.css). */}
      <LineMotion className="header-strip">
        <LineStrip />
      </LineMotion>
    </header>
  );
}
