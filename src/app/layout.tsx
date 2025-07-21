import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/mobile-nav";

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="bg-blue-700 text-white py-4 px-4 md:px-6 shadow-md sticky top-0 z-40 dark:bg-blue-900">
            <div className="container mx-auto flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                IPL T20 Live Dashboard
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a
                  href="#live"
                  className="hover:underline font-medium text-white"
                >
                  Live Match
                </a>
                <a
                  href="#upcoming"
                  className="hover:underline font-medium text-white"
                >
                  Upcoming
                </a>
                <a
                  href="#points"
                  className="hover:underline font-medium text-white"
                >
                  Points Table
                </a>
                <a
                  href="#schedule"
                  className="hover:underline font-medium text-white"
                >
                  Schedule
                </a>
              </nav>
              <MobileNav />
            </div>
          </header>
          <main className="container mx-auto py-6 px-4 md:px-6">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-6 px-4 md:px-6 dark:bg-gray-900 dark:border-t dark:border-gray-800">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-white">
                  © 2025 IPL T20 Live Dashboard. All rights reserved.
                </p>
                <p className="text-sm mt-2 md:mt-0 text-gray-200">
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
