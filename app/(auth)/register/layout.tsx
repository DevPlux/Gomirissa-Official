import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  alternates: {
    canonical: "/register",
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

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
