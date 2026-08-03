import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Твоя история начинается здесь · Волшебное приглашение",
  description: "Пять магических испытаний и тайное приглашение в маленькое приключение.",
  openGraph: {
    title: "Твоя история начинается здесь",
    description: "Совиная почта доставила тебе совершенно секретное приглашение.",
    images: ["/wizard-castle.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
