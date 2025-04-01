import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Arnisekai - Situs Menonton Anime dan Donghua Secara Online & Gratis",
  description: "Arnisekai adalah situs gratis untuk menonton anime dan donghua dengan kualitas ultra HD tanpa registrasi atau pembayaran.",
  keywords: "anime, donghua, streaming, gratis, HD, indonesia",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f1729] text-white`}
      >
        <Navbar />
        <div className="pt-14 custom-scrollbar">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
