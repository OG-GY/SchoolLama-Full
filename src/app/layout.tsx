import Head from 'next/head';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// pages/_app.js or a custom layout component



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School Lama",
  description: "School management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <title>Your App Title</title>
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
