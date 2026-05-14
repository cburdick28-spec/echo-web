import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";
import AuthMenu from "@/components/AuthMenu";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Echo — Pronunciation Practice",
  description: "The best way to practice speaking English, Spanish, French, German & more",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen`}>
        <AuthProvider>
          <AuthMenu />
          <main className="max-w-lg mx-auto px-4 pt-6 pb-20">{children}</main>
          <NavBar />
        </AuthProvider>
      </body>
    </html>
  );
}
