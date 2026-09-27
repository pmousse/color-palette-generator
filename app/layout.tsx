import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteTitle, siteDescription } from "@/lib/seo";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | Color Palette Generator",
  },
  description: siteDescription,
  keywords: [
    "color palette",
    "color generator",
    "color scheme",
    "hex color",
    "color picker",
    "tailwind colors",
    "css variables",
    "accessible colors",
    "brand colors",
    "design tool",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "en_US",
    siteName: "Color Palette Generator",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Color Palette Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL && /^https?:\/\//.test(process.env.NEXT_PUBLIC_SITE_URL)
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "https://color-palette-generator.example.com"
  ),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <ErrorBoundary>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
