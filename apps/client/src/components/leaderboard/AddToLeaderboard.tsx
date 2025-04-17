"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

function formatAddress(address: string): string {
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
}

function generateNonce(): number {
  return Math.floor(Math.random() * 1000000);
}

function formatTimestamp(date: Date): string {
  return date.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

export function AddToLeaderboard() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [authStatus, setAuthStatus] = useState<{
    isLoading: boolean;
    error?: string;
    success?: boolean;
  }>({
    isLoading: false,
  });

  async function handleAddToLeaderboard() {
    if (!address) return;

    const nonce = generateNonce();
    const timestamp = formatTimestamp(new Date());
    const message = `web3-demo-dapp leaderboard participation confirmation

Wallet: ${formatAddress(address)}
Nonce: ${nonce}
Timestamp: ${timestamp}

I agree to be listed on the leaderboard.`;

    setAuthStatus({ isLoading: true });

    try {
      const signature = await signMessageAsync({ message });
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          signature,
          address,
        }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      setAuthStatus({ isLoading: false, success: true });
    } catch (error) {
      setAuthStatus({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to authenticate",
      });
    } finally {
      setAuthStatus((current) => ({ ...current, isLoading: false }));
    }
  }

  if (!isConnected) {
    return null;
  }

  return (
    <div className="my-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-4">
        <button
          onClick={handleAddToLeaderboard}
          disabled={authStatus.isLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {authStatus.isLoading
            ? "Adding to Leaderboard..."
            : "Add to Leaderboard"}
        </button>
        {authStatus.success && (
          <span className="text-green-500 font-medium">
            Successfully added to leaderboard!
          </span>
        )}
        {authStatus.error && (
          <span className="text-red-500 font-medium">{authStatus.error}</span>
        )}
      </div>
    </div>
  );
}
