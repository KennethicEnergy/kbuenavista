import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import Link from "next/link";
import { AuthProvider } from "@/components/auth/auth-provider";
import DynamicTitle from "@/components/dynamic-title/dynamic-title";
import TopLoader from "@/components/top-loader/top-loader";
import { Toaster } from "@/components/ui/toaster";
import { site } from "@/content/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kenneth Buenavista",
    template: "%s | Kenneth Buenavista",
  },
  description:
    "Senior Frontend Developer portfolio — React, Next.js, TypeScript, and modern web experiences.",
  openGraph: {
    title: "Kenneth Buenavista",
    description:
      "Senior Frontend Developer portfolio — React, Next.js, TypeScript, and modern web experiences.",
    type: "website",
    locale: "en_US",
    siteName: "Kenneth Buenavista",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenneth Buenavista",
    description:
      "Senior Frontend Developer portfolio — React, Next.js, TypeScript, and modern web experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1628",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <AuthProvider>
          <TopLoader />
          <DynamicTitle />
          <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 md:px-8">
            <main className="flex-1">{children}</main>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-bg-elevated py-8 text-sm text-text-muted">
              <span>© {new Date().getFullYear()} Kenneth Buenavista</span>
              <Link
                href="/privacy"
                className="text-text-muted underline-offset-4 hover:text-brand hover:underline"
              >
                Privacy Policy
              </Link>
            </footer>
          </div>
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
