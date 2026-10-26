import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GARDA-SIM AI — Cyber Defense Response Simulator",
  description:
    "Defensive cyber incident response simulation platform. Simulate candidate response strategies, evaluate virtual IT/OT impact, and enforce deterministic safety policies.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary text-text-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
