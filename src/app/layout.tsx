import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ToastProvider from "@/components/layout/ToastProvider";
import ThemeProvider from "@/components/layout/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const akira = localFont({
  src: "../fonts/AkiraExpandedDemo.otf",
  variable: "--font-akira",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fit Coder — The Lifestyle of Legends",
  description:
    "Heavyweight streetwear designed for those who create their own path. Shop hoodies, sweatpants, and jackets from Fit Coder.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${akira.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
