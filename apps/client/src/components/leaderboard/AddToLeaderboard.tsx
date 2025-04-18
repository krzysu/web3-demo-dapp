"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

interface AuthData {
  message: string;
  signature: string;
  address: string;
}

async function addToLeaderboardRequest(data: AuthData) {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  return response.json();
}

export function AddToLeaderboard() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const queryClient = useQueryClient();
  const [signError, setSignError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: addToLeaderboardRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });

  async function handleAddToLeaderboard() {
    if (!address) return;

    // Clear previous error state
    setSignError(null);

    const nonce = generateNonce();
    const timestamp = formatTimestamp(new Date());
    const message = `web3-demo-dapp leaderboard participation confirmation

Wallet: ${formatAddress(address)}
Nonce: ${nonce}
Timestamp: ${timestamp}

I agree to be listed on the leaderboard.`;

    try {
      const signature = await signMessageAsync({ message });
      await mutation.mutateAsync({
        message,
        signature,
        address,
      });
    } catch (error) {
      // Set error state with the caught error message
      setSignError(
        error instanceof Error ? error.message : "Failed to sign message"
      );
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
          disabled={mutation.isPending}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {mutation.isPending
            ? "Adding to Leaderboard..."
            : "Add to Leaderboard"}
        </button>
        {mutation.isSuccess && (
          <span className="text-green-500 font-medium">
            Successfully added to leaderboard!
          </span>
        )}
        {(mutation.isError || signError) && (
          <span className="text-red-500 font-medium">
            {mutation.error instanceof Error
              ? mutation.error.message
              : signError || "Failed to authenticate"}
          </span>
        )}
      </div>
    </div>
  );
}
