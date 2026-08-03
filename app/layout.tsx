import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Особенное письмо · Волшебное приглашение",
  description: "Романтический квест и меню желаний для одного особенного приключения.",
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
