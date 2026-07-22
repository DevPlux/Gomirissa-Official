import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your GoMirissa bookings.",
  alternates: {
    canonical: "/my-bookings",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function MyBookingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
