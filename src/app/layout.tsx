import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Innov8Edge Academy",
    default: "Innov8Edge Academy — Learn AI Automation by Building Real AI Systems",
  },
  description:
    "The fastest way for ordinary people to become AI builders. Master AI workflows, agents, MCP, and automation through hands-on interactive sandboxes.",
  keywords: [
    "AI automation",
    "AI education",
    "AI agents",
    "MCP",
    "workflow automation",
    "AI sandbox",
    "learn AI",
    "AI builder",
    "Innov8Edge",
  ],
  openGraph: {
    title: "Innov8Edge Academy — Learn AI Automation by Building",
    description:
      "Master AI workflows, agents, and automation through interactive sandboxes. No coding required.",
    type: "website",
  },
};

import MobileToggle from "@/components/ui/MobileToggle";
import { AuthProvider } from "@/context/AuthContext";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <AnalyticsProvider />
          {children}
          <MobileToggle />
        </AuthProvider>
      </body>
    </html>
  );
}
