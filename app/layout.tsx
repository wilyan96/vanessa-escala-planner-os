import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eventora Planner",
  description: "Plataforma de gestion integral para organizadoras de eventos"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
