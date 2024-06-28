import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from './../components/ui/toaster';
import AuthProvider from "./context/AuthProvider";
import Navbar from './../components/ui/ui/navbar';
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonymous Feedbacks Platform",
  description: "AI-powered anonymous feedback and comments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <AuthProvider>
      <body className={inter.className}>{children}
        {children}
        <Toaster/>
      </body>
      </AuthProvider>
      
    </html>
  );
}
