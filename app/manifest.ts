import type { MetadataRoute } from "next";

/**
 * Served at /manifest.webmanifest. The icons here are referenced by path and
 * live in public/icons, separate from the app/icon.png and app/apple-icon.png
 * file conventions — an installed app and a browser tab read different sources.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AiPulse",
    short_name: "AiPulse",
    // Same wording as the description in app/layout.tsx: the product is
    // Hebrew-only, so the install prompt should not be the one English string.
    description:
      "סריקה יומית של חדשות ומחקר בתחום הבינה המלאכותית בבריאות, בעברית, עם קישור למקור הראשוני.",
    start_url: "/",
    display: "standalone",
    background_color: "#0EA5E9",
    theme_color: "#0EA5E9",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
