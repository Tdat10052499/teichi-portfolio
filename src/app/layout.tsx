import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Teichi D. — Web3, Research & Creative Engineering",
  description: "Teichi D. — creative engineer building thoughtful Web3 experiences, decentralized applications and blockchain infrastructure.",
  openGraph: {
    title: "Teichi D. — Web3, Research & Creative Engineering",
    description: "Teichi D. — creative engineer building thoughtful Web3 experiences, decentralized applications and blockchain infrastructure.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
