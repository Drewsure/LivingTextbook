import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Living Textbook",
  description: "White-label learning portal foundation",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
