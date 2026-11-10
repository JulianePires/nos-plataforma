import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nós Plataforma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* Without globals.css the browser default font is serif; Tailwind replaces this in NOS-3. */}
      <body style={{ fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
