import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Does this time work for you?",
  description: "Pick two timezones and a point in time so you can arrange a call, session or anything easily with your friends",
};

export const viewport: Viewport = {
  themeColor: "#3B82F6"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
