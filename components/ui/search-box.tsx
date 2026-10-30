/**
 * The search form, in the header and on /search.
 *
 * A plain GET form to /search, so it works with JavaScript disabled and
 * needs no client component. `defaultValue` pre-fills the current query on
 * the results page; the header leaves it empty. `variant="sign"` sets it on
 * the indigo header panel; the default sits on the floor.
 */
export function SearchBox({
  defaultValue = "",
  variant = "floor",
}: {
  defaultValue?: string;
  variant?: "floor" | "sign";
}) {
  const onSign = variant === "sign";
  return (
    <form action="/search" method="get" role="search" className="flex items-stretch">
      {/* Wrapping label rather than htmlFor: /search renders this twice
          (header and page), and duplicate ids would break the pairing. */}
      <label className="flex">
        <span className="sr-only">חיפוש בארכיון</span>
        {/* suppressHydrationWarning: some browser extensions write inline
            styles (e.g. caret-color) onto every input before React hydrates.
            It covers this element's own attributes only. */}
        <input
          suppressHydrationWarning
          type="search"
          name="q"
          dir="auto"
          defaultValue={defaultValue}
          placeholder="חיפוש בארכיון…"
          className={
            onSign
              ? "min-h-11 sm:min-h-10 w-52 border border-sign-ink/40 bg-sign-2 px-3 text-[0.9375rem] text-sign-ink placeholder:text-sign-ink-2 focus:border-sign-ink"
              : "min-h-11 w-full min-w-0 border border-ink-3 bg-surface px-3 text-base text-ink placeholder:text-ink-3 focus:border-ink sm:w-80"
          }
        />
      </label>
      <button
        type="submit"
        className={
          onSign
            ? "min-h-11 sm:min-h-10 border border-s-0 border-sign-ink/40 px-3 font-display text-sm font-medium text-sign-ink transition-colors hover:bg-sign-2"
            : "min-h-11 border border-sign-line bg-sign px-4 font-display text-sm font-medium text-sign-ink transition-colors hover:bg-sign-2"
        }
      >
        חיפוש
      </button>
    </form>
  );
}
