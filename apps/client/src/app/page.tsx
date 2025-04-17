"use client";

import { TokenBalances } from "@/components/token/TokenBalances";
import { AddToLeaderboard } from "@/components/leaderboard/AddToLeaderboard";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Web3 Demo dApp</h1>
      </div>

      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Welcome to our Web3 demonstration application. Connect your wallet to
        see your token balances and add them to the leaderboard.
      </p>

      <AddToLeaderboard />
      <TokenBalances />
    </div>
  );
}
