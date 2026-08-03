import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Официальное приглашение для Анны Сергеевны",
  description: "Персональное магическое приглашение для Кушпиты Анны Сергеевны.",
  openGraph: {
    title: "Официальное приглашение для Анны Сергеевны",
    description: "Совиная почта доставила персональное магическое приглашение.",
    images: ["/wizard-castle.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#05070b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
