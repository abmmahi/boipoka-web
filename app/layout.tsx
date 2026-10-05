import type { Metadata } from "next";
import "@fontsource/hind-siliguri/bengali-400.css";
import "@fontsource/hind-siliguri/bengali-500.css";
import "@fontsource/hind-siliguri/bengali-600.css";
import "@fontsource/hind-siliguri/latin-400.css";
import "@fontsource/hind-siliguri/latin-500.css";
import "@fontsource/hind-siliguri/latin-600.css";
import "@fontsource/noto-serif-bengali/bengali-400.css";
import "@fontsource/noto-serif-bengali/bengali-600.css";
import "@fontsource/noto-serif-bengali/bengali-700.css";
import "@fontsource/noto-serif-bengali/latin-400.css";
import "@fontsource/noto-serif-bengali/latin-600.css";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "বইপোকা | তোমার বইপড়ার পরিচয়",
  description:
    "তোমার পড়া বই, প্রিয় লেখক ও পাঠাভ্যাস দিয়ে তৈরি করো নিজের Reading Identity Card.",
  openGraph: {
    title: "বইপোকা | তোমার বইপড়ার পরিচয়",
    description:
      "তোমার পড়া বই, প্রিয় লেখক ও পাঠাভ্যাস দিয়ে তৈরি করো নিজের Reading Identity Card.",
    type: "website",
    locale: "bn_BD",
    siteName: "Boipoka",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
