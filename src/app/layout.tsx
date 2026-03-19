import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { getCurrentUserWithFallback } from "@/lib/demo-auth";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Ranked Prep Assistant",
    template: "%s | Ranked Prep Assistant",
  },
  description:
    "A second-screen tactical prep app for Rainbow Six Siege ranked matches.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUserWithFallback();

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[color:var(--surface-0)] font-sans">
        <AppShell userName={user?.displayName}>{children}</AppShell>
      </body>
    </html>
  );
}
