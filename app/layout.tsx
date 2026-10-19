import type { Metadata } from "next";
import "./globals.css";
import { Store } from "@/components/store";
export const metadata: Metadata = {
  title: "KIRARA — Kisah Rakyat Madura",
  description: "Belajar cerita dan budaya Madura bersama Sakera dan Marlena.",
  icons: { icon: "/assets/logo.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="world-theme">
        <Store>{children}</Store>
      </body>
    </html>
  );
}
