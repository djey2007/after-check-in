import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "After Check-in",
  description:
    "Application sociale pour rencontrer des voyageurs disponibles autour de son hotel, sans localisation precise."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

