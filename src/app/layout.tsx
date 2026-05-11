import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const interSerif = Inter({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "We Want The Truth",
  description:
    "Public-interest legal transparency software. Organize documents, timelines, evidence, and community review—not legal advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${interSerif.variable} min-h-screen bg-[var(--background)] font-sans antialiased`}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
