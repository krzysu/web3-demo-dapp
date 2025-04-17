"use client";

import Link from "next/link";
import { ConnectKitButton } from "connectkit";

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="text-xl font-semibold">Web3 Demo</div>
          <nav className="flex gap-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Home
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Leaderboard
            </Link>
          </nav>
        </div>
        <ConnectKitButton />
      </div>
    </header>
  );
}
