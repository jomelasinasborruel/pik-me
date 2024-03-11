import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/public/fonts/runcort/stylesheet.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pik-me",
  description: "Mini project",
  metadataBase: new URL("https://pik-me.vercel.app/"),
  openGraph: { images: "/opengraph-image.png" },
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
