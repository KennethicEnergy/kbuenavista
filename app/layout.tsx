import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, Syne } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
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
    <html lang="en" className={`${syne.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <AuthProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 md:px-8">
            <main className="flex-1">{children}</main>
            <footer className="border-t border-bg-elevated py-8 text-sm text-text-muted">
              © {new Date().getFullYear()} Kenneth Buenavista
            </footer>
          </div>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
