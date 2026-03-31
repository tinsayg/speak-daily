import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpeakUp — Daily Speaking Coach",
  description:
    "Improve your speaking skills with daily video uploads, rule-based audio analysis, and progress tracking.",
  keywords: ["speaking coach", "communication skills", "public speaking", "speech analysis"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-bg text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
