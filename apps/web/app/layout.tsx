import type { Metadata } from "next";
import { Commissioner, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const commissioner = Commissioner({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-commissioner",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Nós Plataforma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      className={`${commissioner.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
