import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | ZeynepNova — Zarif & Özgün Takı Tasarımları",
    default: "ZeynepNova | Zarif & Özgün Takı Tasarımları — Kolye, Küpe, Yüzük, Bileklik",
  },
  description:
    "ZeynepNova'nın seçkin takı koleksiyonunu keşfedin. 925 ayar gümüş, altın kaplama kolyeler, küpeler, zarif yüzükler ve bileklikler güvenli alışveriş ve hızlı kargo ile kapınızda.",
  keywords: [
    "takı",
    "kolye",
    "küpe",
    "yüzük",
    "bileklik",
    "takı seti",
    "altın kaplama",
    "gümüş takı",
    "ZeynepNova",
  ],
  authors: [{ name: "ZeynepNova" }],
  creator: "ZeynepNova",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "ZeynepNova",
    title: "ZeynepNova | Zarif & Özgün Takı Tasarımları",
    description: "Zarafeti stilinize taşıyan özel tasarım takı ve aksesuar koleksiyonları.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-sand-50 text-charcoal-900 selection:bg-gold-200 selection:text-gold-900 antialiased">
        {children}
      </body>
    </html>
  );
}
