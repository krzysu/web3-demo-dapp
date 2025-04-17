import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WalletProvider } from "@/providers/web3/WalletProvider";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3 Demo dApp",
  description: "A demo dApp with wallet connection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <WalletProvider>
          <header className="border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="text-xl font-semibold">Web3 Demo</div>
              <ConnectWallet />
            </div>
          </header>

          <main className="flex-grow">{children}</main>

          <footer className="border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Built with Next.js, ConnectKit, and Tailwind CSS
            </div>
          </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
