# AiPulse — הוראות פרויקט לקלוד קוד

קרא את `PRD.md` לפני שאתה כותב קוד, ואת `SPEC.md` לפרטים הטכניים.
`BUILD_ORDER.md` מגדיר את סדר העבודה — אל תדלג שלבים ואל תבנה שלב 2 לפני ששלב 1 עובד.

## כללי ברזל

1. **RTL הוא ברירת המחדל, לא תוספת.** `<html lang="he" dir="rtl">`. אסור להשתמש
   ב-`left`/`right`/`ml-`/`mr-`/`pl-`/`pr-` — רק בתכונות לוגיות: `ms-`/`me-`/`ps-`/`pe-`,
   `start`/`end`, `inset-inline-start`. **מלכודת מוכחת:** `inset-inline-start` נפתר לפי
   ה-`direction` של האלמנט עצמו. אם תשים `direction:ltr` על אלמנט ממוקם, המיקום שלו
   יתהפך. שם מותג לטיני לא צריך `direction:ltr` — הוא רצף LTR אחיד ממילא.

2. **אף פעם אל תמציא תוכן.** הפריטים ב-`content/items.json` הם ידיעות אמיתיות עם
   קישורים אמיתיים. אל תוסיף, תשנה או "תשפר" פריט. אל תייצר פריטי דמה — אם צריך
   מצב ריק לבדיקה, סנן את המערך הקיים.

3. **הסכימה היא חוזה.** `lib/schema.ts` מגדיר את מבנה הפריט ב-Zod. הבנייה חייבת
   ליפול אם `content/items.json` לא עובר ולידציה. זה מגן על העמוד מפני סריקה
   יומית שכתבה JSON פגום.

4. **מצב המשתמש נשאר בצד הלקוח בשלב 1.** localStorage בלבד, בלי חשבונות ובלי
   בסיס נתונים. עטוף את כל הגישה אליו במודול אחד (`lib/user-state.ts`) עם ממשק
   נקי, כדי ששלב 2 יוכל להחליף אותו במסד נתונים בלי לגעת בקומפוננטות.

5. **כל גישה ל-localStorage בתוך try/catch.** היא זורקת בגלישה פרטית ובדפדפנים
   שחוסמים אחסון. העמוד חייב להיטען נכון גם כשאין מצב שמור.

6. **טעינה ראשונה בלי הבהוב.** הפיד מוגש סטטית מהשרת; מצב המשתמש נטען אחריו
   בצד הלקוח. אל תעכב את רינדור התוכן בהמתנה ל-localStorage, ואל תיתן לרשימה
   לקפוץ כשהוא מגיע.

7. **מצב כהה לפי מערכת ההפעלה, עם דריסה ידנית.** אל תגדיר צבע רק בתוך
   media query — הגדר את כל הפלטה על `:root` ודרוס בכהה.

8. **גילוי נאות הוא דרישה.** התקצירים מופקים בסריקה אוטומטית. שורת הגילוי
   בפוטר ובעמוד השיטה אינה קישוט — אל תסיר אותה ואל תרכך אותה.

9. **אל תגזום את הארכיון.** בגרסה הדשבורדית נשמרו רק ~28 פריטים כי זה היה מסך
   אחד. באתר כל פריט נשאר לתמיד. אם אתה כותב קוד שמוחק פריטים לפי גיל — עצור.

10. **אין להריץ `npm run build` כששרת הפיתוח פעיל.** עצור אותו קודם. שני
    התהליכים כותבים לאותם קובצי טיפוסים ב-`.next/dev/types/`, והרצה במקביל
    משחיתה אותם ומייצרת שגיאות מדומות שנראות כמו באג בקוד ואינן כאלה.
    **מלכודת מוכחת:** `tsconfig.json` כולל את `.next/dev/types/**/*.ts`
    בבדיקת הטיפוסים, ולכן הזבל שנוצר הופך לשגיאת בנייה. אם ראית שגיאת
    תחביר בקובץ בתוך `.next` — זו התופעה הזאת. עצור את השרת, מחק את
    `.next`, ובנה מחדש.

## סגנון קוד

- TypeScript קפדני. בלי `any`, בלי `@ts-ignore`.
- קומפוננטות שרת כברירת מחדל. `"use client"` רק היכן שיש אינטראקציה.
- בלי ספריות UI כבדות. Tailwind בלבד; אין צורך ב-shadcn לפרויקט בגודל הזה.
- שמות קבצים kebab-case, קומפוננטות PascalCase.
- הערות בעברית או באנגלית — עקבי בכל הקובץ, לא מעורבב.

## מה לא לעשות

- אל תוסיף אנליטיקס, באנר עוגיות, ניוזלטר או צ'אט-בוט. לא ביקשו.
- אל תמיר את הפרויקט ל-Pages Router.
- אל תשנה את הפלטה או את הגופנים — הם מוגדרים ב-`SPEC.md` ומגיעים מזהות קיימת.
- אל תיצור `README.md` אלא אם ביקשו במפורש.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
