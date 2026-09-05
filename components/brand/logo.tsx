/**
 * סימן AiPulse — טבעת (הסריקה היומית), אות נבחרת במרכזה, ונקודה אחת
 * בחלודה: הפריט שסומן.
 *
 * מוטמע inline ולא כ-<img> בכוונה. קובץ SVG שנטען כתמונה הוא מסמך מבודד
 * שלא רואה את הטוקנים של הדף, ולכן היה קופא על צבעי המצב הבהיר. כרכיב
 * מוטמע הוא קורא את --accent ואת --pin ישירות, ולכן עוקב גם אחרי מצב
 * המערכת וגם אחרי הדריסה הידנית.
 */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="30"
        cy="34"
        r="20.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.6"
      />
      <circle cx="30" cy="34" r="6.8" fill="var(--accent)" />
      <circle cx="47.5" cy="16.5" r="4.2" fill="var(--pin)" />
    </svg>
  );
}
