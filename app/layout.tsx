import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Assistant, Rubik } from "next/font/google";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { motionScript, themeScript } from "@/lib/theme";
import "./globals.css";

// Rubik carries the signage: headings, the brand, numerals and controls.
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: "variable",
  variable: "--font-rubik",
  display: "swap",
});

// Assistant carries the reading: summaries and running text.
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: "variable",
  variable: "--font-assistant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AiPulse — סריקה יומית של AI בבריאות",
  description:
    "סריקה יומית של חדשות ומחקר בתחום הבינה המלאכותית בבריאות, בעברית, עם קישור למקור הראשוני.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} ${assistant.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Blocking, before first paint: a reader who chose a theme must never
          see the other one flash. This is the one place a synchronous inline
          script is the right tool — anything deferred is already too late.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeScript + motionScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <div className="grow">{children}</div>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
