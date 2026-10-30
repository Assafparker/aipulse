/**
 * The theme key and the blocking head scripts.
 *
 * These live here, not in theme-toggle.tsx: that file is "use client", and a
 * value exported from a client module reaches a server component as a client
 * reference, not as the string. layout.tsx would then inline a function stub
 * instead of the script — a syntax error, and the saved theme never replayed.
 */

export const THEME_KEY = "aipulse:theme";

/**
 * Runs blocking in <head>, before first paint, so a reader who chose a theme
 * never sees the other one flash. Kept tiny for that reason.
 */
export const themeScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

/**
 * Marks the document as motion-capable before first paint, so decorative
 * lines can start unpainted without a flash. Reduced-motion readers never get
 * the class, and everything renders in its final state.
 */
export const motionScript = `try{if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`;
