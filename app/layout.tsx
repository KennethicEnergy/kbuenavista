import "./globals.css";

import Alert from "./components/alert/alert";
import Loader from "./components/loader/loader";
import DynamicTitle from "./components/dynamic-title/dynamic-title";
import { AuthProvider } from "./providers/auth-provider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import styles from "./page.module.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kenneth Buenavista",
    template: "%s | Kenneth Buenavista",
  },
  description: "Senior Frontend Developer portfolio — React, Next.js, TypeScript, and modern web experiences.",
  openGraph: {
    title: "Kenneth Buenavista",
    description: "Senior Frontend Developer portfolio — React, Next.js, TypeScript, and modern web experiences.",
    type: "website",
    locale: "en_US",
    siteName: "Kenneth Buenavista",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenneth Buenavista",
    description: "Senior Frontend Developer portfolio — React, Next.js, TypeScript, and modern web experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171717",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider>
          <DynamicTitle />
          <Loader/>
          <Alert />
          <div id="layout-container" className={styles.container}>
            <main className={styles.main}>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
