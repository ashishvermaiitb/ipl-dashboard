"use client";

import { useState } from "react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="focus:outline-none text-white"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 mobile-nav">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Menu
              </h2>
              <button
                onClick={toggleMenu}
                className="focus:outline-none text-gray-600 dark:text-gray-300"
                aria-label="Close menu"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 p-4">
              <ul className="space-y-6">
                <li>
                  <a
                    href="#live"
                    className="block text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Live Match
                  </a>
                </li>
                <li>
                  <a
                    href="#upcoming"
                    className="block text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Upcoming Matches
                  </a>
                </li>
                <li>
                  <a
                    href="#points"
                    className="block text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Points Table
                  </a>
                </li>
                <li>
                  <a
                    href="#schedule"
                    className="block text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Match Schedule
                  </a>
                </li>
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
              © 2025 IPL T20 Live Dashboard
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
