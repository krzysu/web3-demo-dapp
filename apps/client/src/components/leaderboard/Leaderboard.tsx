"use client";

import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface LeaderboardEntry {
  address: string;
  firstAuth: string;
  lastAuth: string;
  authCount: number;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
  limit: number;
  offset: number;
}

async function fetchLeaderboard(
  page: number,
  limit: number
): Promise<LeaderboardResponse> {
  const response = await fetch(
    `api/leaderboard?limit=${limit}&offset=${page * limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return response.json();
}

export function Leaderboard() {
  const [page, setPage] = useState(0);
  const limit = 10;
  const { address } = useAccount();

  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboard", page],
    queryFn: () => fetchLeaderboard(page, limit),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
        Failed to load leaderboard data. Please try again later.
      </div>
    );
  }

  if (!data || data.entries.length === 0) {
    return <div>No leaderboard entries found</div>;
  }

  const totalPages = Math.ceil(data.total / limit);

  return (
    <div>
      <div className="w-full bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Auth Count
                </th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  First Seen
                </th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Seen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.entries.map((entry, index) => (
                <tr
                  key={entry.address}
                  className={
                    entry.address === address
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }
                >
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {page * limit + index + 1}
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-mono text-sm">
                    <div
                      className="max-w-[120px] sm:max-w-none truncate"
                      title={entry.address}
                    >
                      {entry.address}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {entry.authCount}
                  </td>
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(entry.firstAuth), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(entry.lastAuth), {
                      addSuffix: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 order-2 sm:order-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px]"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px]"
            >
              Next
            </button>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 order-1 sm:order-2">
            Page {page + 1} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
