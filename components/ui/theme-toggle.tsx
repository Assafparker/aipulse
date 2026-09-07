"use client";

/**
 * Manual light/dark override.
 *
 * Kept out of lib/user-state.ts on purpose: this is a display preference for
 * one browser, not reading state, and it must be readable by a blocking
 * script before hydration. It has its own key and its own lifecycle.
 *
 * There is deliberately no React state here. The button renders identically
 * on the server and the client, and which icon shows is decided in CSS from
 * the same rules that drive the palette. That removes any hydration mismatch,
 * and with it the flash this component exists to prevent.
 */

export const THEME_KEY = "aipulse:theme";

/**
 * Runs blocking in <head>, before first paint, so a reader who chose dark
 * never sees a light flash. Kept tiny for that reason.
 */
export const themeScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    // No data-theme yet means the reader has never chosen, and the default
    // is dark unconditionally — the OS preference is not consulted here, or
    // in globals.css. Reading it back would make the first click a no-op for
    // anyone on a light system.
    const current = root.getAttribute("data-theme") ?? "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked. The override still applies for this page view.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="החלף בין מצב בהיר לכהה"
      title="החלף בין מצב בהיר לכהה"
      className="rounded-md border border-line p-2 text-ink-2 hover:border-line-2 hover:text-ink"
    >
      {/* Both icons ship; CSS shows whichever matches the effective theme. */}
      <svg
        className="theme-icon-light size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
      </svg>
      <svg
        className="theme-icon-dark size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M20.5 14.3A8.6 8.6 0 1 1 9.7 3.5a6.9 6.9 0 0 0 10.8 10.8z" />
      </svg>
    </button>
  );
}
