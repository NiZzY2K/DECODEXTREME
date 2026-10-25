import type { Metadata } from "next";
import localFonts from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import SmoothScroll from "./components/SmoothScroll";
import { site } from "./config";

const satoshi = localFonts({
  src: [
    { path: "./fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
    { path: "./fonts/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body>
        <a className="skip-link" href="#main-content">{site.skipLink}</a>
        <SmoothScroll />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
