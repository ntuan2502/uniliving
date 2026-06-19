import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uni Living - Không gian sống Xanh cho thế hệ trẻ năng động.",
  description: "Uni Living chuyên cung cấp giải pháp tư vấn, kết nối phòng trọ & căn hộ dịch vụ cao cấp, đầy đủ tiện nghi với không gian xanh mát lành tại TP. Hồ Chí Minh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
