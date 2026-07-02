import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Living Textbook",
  title: "Living Textbook",
  description: "White-label learning portal foundation",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/living-textbook-icon.svg",
    apple: "/icons/living-textbook-icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Living Textbook",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
