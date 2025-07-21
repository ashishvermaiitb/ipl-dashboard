// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPL T20 Live Dashboard",
  description:
    "Real-time updates for IPL T20 matches, points table, and schedule",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-blue-600 text-white py-4 px-4 md:px-6 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold">
                IPL T20 Live Dashboard
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#live" className="hover:underline font-medium">
                  Live Match
                </a>
                <a href="#points" className="hover:underline font-medium">
                  Points Table
                </a>
                <a href="#schedule" className="hover:underline font-medium">
                  Schedule
                </a>
              </nav>
              <button className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </header>
          <main className="container mx-auto py-6 px-4 md:px-6">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-6 px-4 md:px-6">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm">
                  © 2025 IPL T20 Live Dashboard. All rights reserved.
                </p>
                <p className="text-sm mt-2 md:mt-0">
                  Data sourced from iplt20.com
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
