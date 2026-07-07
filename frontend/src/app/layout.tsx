import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import Nav from "@/components/Nav";
import Doodles from "@/components/Doodles";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TodoApp",
  description: "A simple todo application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          <Doodles />
          <Nav />
          <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
