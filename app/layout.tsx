import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["700", "900"],
  variable: "--font-frank-ruhl",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-heebo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
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
      className={`${frankRuhl.variable} ${heebo.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
