import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Đặt phòng khách sạn",
  description: "Website đặt phòng trực tuyến",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
