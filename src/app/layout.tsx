import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/layout/ToastProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dope Beyond — The Lifestyle of Legends",
  description:
    "Heavyweight streetwear designed for those who create their own path. Shop hoodies, sweatpants, and jackets from Dope Beyond.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
