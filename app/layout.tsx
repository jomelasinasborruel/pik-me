import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/public/fonts/runcort/stylesheet.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pic-me",
  description: "Mini project",
};

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
