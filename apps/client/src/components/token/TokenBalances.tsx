"use client";

import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import Image from "next/image";

interface TokenMetadata {
  logo?: string;
}

interface TokenBalance {
  name: string;
  symbol: string;
  balance: string;
  chain: string;
  decimals: number;
  value_usd?: number;
  token_metadata: TokenMetadata;
}

interface BalancesResponse {
  address: string;
  balances: TokenBalance[];
}

async function fetchBalances(address: string): Promise<TokenBalance[]> {
  const response = await fetch(`/api/balances/${address}`);
  if (!response.ok) {
    throw new Error("Failed to fetch balances");
  }
  const data: BalancesResponse = await response.json();
  return data.balances;
}

function formatBalance(balance: string, decimals: number = 18): string {
  try {
    return formatUnits(BigInt(balance), decimals);
  } catch {
    return balance;
  }
}

function formatUSD(value?: number): string {
  if (value == null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function TokenBalances() {
  const { address, isConnected } = useAccount();

  const {
    data: balances,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["balances", address],
    queryFn: () => fetchBalances(address!),
    enabled: Boolean(address && isConnected),
  });

  if (!isConnected) {
    return null;
  }

  if (isLoading) {
    return <div className="mt-8">Loading balances...</div>;
  }

  if (error) {
    return (
      <div className="mt-8 text-red-500">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  if (!balances || balances.length === 0) {
    return <div className="mt-8">No token balances found</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Token Balances</h2>
      <div className="grid gap-4">
        {balances.map((token, index) => (
          <div
            key={`${token.chain}-${token.symbol}-${index}`}
            className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {token.token_metadata.logo && (
                  <Image
                    src={token.token_metadata.logo}
                    alt={token.symbol}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    {token.name || token.symbol}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {token.symbol} on {token.chain}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono">
                  {formatBalance(token.balance, token.decimals)} {token.symbol}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">
                    {formatUSD(token.value_usd)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
