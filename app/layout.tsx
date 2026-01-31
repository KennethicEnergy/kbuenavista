import "./globals.css";

import Alert from "./components/alert/alert";
import Loader from "./components/loader/loader";
import DynamicTitle from "./components/dynamic-title/dynamic-title";
import { AuthProvider } from "./providers/auth-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import styles from "./page.module.scss";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kenneth Buenavista",
  description: "Frontend Developer Portfolio",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
