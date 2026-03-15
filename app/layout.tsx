// app/layout.tsx
import { AuthProvider } from "@/context/AuthContext"; // නිවැරදි path එක දෙන්න
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Mirissa Adventures",
  description: "Explore the beauty of Mirissa with us!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}