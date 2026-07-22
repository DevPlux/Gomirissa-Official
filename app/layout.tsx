// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/context/AuthContext";
import BackToTop from "@/components/BackToTop";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = "https://www.gomirissa.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Mirissa Boat Tours, Fishing & Snorkeling | GoMirissa",
    template: "%s | GoMirissa",
  },

  description:
    "Book ocean adventures in Mirissa, Sri Lanka, including deep-sea fishing, snorkeling with turtles and snorkeling with whales with an experienced local crew.",

  applicationName: "GoMirissa",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GoMirissa",
    title: "Mirissa Boat Tours, Fishing & Snorkeling | GoMirissa",
    description:
      "Discover deep-sea fishing, snorkeling with turtles and whale snorkeling adventures in Mirissa, Sri Lanka.",
    images: [
      {
        url: "/images/gomirissa-og.png",
        width: 1200,
        height: 630,
        alt: "GoMirissa boat tours, deep-sea fishing and snorkeling adventures",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mirissa Boat Tours, Fishing & Snorkeling | GoMirissa",
    description:
      "Book deep-sea fishing and snorkeling adventures in Mirissa, Sri Lanka.",
    images: ["/images/gomirissa-og.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        <BackToTop />
      </body>
    </html>
  );
}
