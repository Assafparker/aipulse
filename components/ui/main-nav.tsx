"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The header's directory links. A client component only so the current
 * section can carry aria-current and the "you are here" bar.
 */

const NAV = [
  { href: "/feed", label: "הפיד" },
  { href: "/archive", label: "הארכיון" },
  { href: "/about", label: "השיטה" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <ul className="flex gap-1 font-display text-[0.9375rem] font-medium">
      {NAV.map((n) => {
        const here = pathname === n.href || pathname.startsWith(`${n.href}/`);
        return (
          <li key={n.href}>
            <Link
              href={n.href}
              aria-current={here ? "page" : undefined}
              className="relative inline-flex min-h-11 items-center px-2.5 text-sign-ink-2 transition-colors hover:bg-sign-2 hover:text-sign-ink aria-[current=page]:text-sign-ink sm:min-h-10"
            >
              {n.label}
              {here && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2.5 bottom-0 h-[3px] bg-sign-ink"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
