import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deyline - Plan with clarity",
  description: "A calm local-first deadline planner",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
