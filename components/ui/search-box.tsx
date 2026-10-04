/**
 * The search form, in the header and on /search.
 *
 * A plain GET form to /search, so it works with JavaScript disabled and
 * needs no client component. `defaultValue` pre-fills the current query on
 * the results page; the header leaves it empty.
 */
export function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" method="get" role="search" className="flex items-center gap-2">
      {/* Wrapping label rather than htmlFor: /search renders this twice
          (header and page), and duplicate ids would break the pairing. */}
      <label>
        <span className="sr-only">חיפוש בארכיון</span>
        <input
          type="search"
          name="q"
          dir="auto"
          defaultValue={defaultValue}
          placeholder="חיפוש בארכיון…"
          className="w-44 rounded-md border border-line bg-surface px-2.5 py-1 text-sm text-ink placeholder:text-ink-3 focus:border-accent"
        />
      </label>
      <button
        type="submit"
        className="rounded-md border border-line px-2.5 py-1 text-sm text-ink-2 hover:border-line-2 hover:text-ink"
      >
        חיפוש
      </button>
    </form>
  );
}
