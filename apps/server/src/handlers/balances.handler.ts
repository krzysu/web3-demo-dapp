import type { DuneBalanceResponse } from "../types/dune.types.js";
import type { BalancesResponse } from "../schemas/balances.schema.js";
import { ValidationError, ApiError } from "../utils/errors.js";
import { buildTokenBalance } from "../utils/builders.js";

/**
 * Fetches token balances for an Ethereum address using Dune Echo API
 * @throws {ValidationError} If the address format is invalid
 * @throws {Error} If API key is missing or API request fails
 */
export async function getTokenBalances(
  address: string
): Promise<BalancesResponse> {
  // Validate input
  if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new ValidationError("Invalid Ethereum address format");
  }

  const apiKey = process.env.DUNE_API_KEY;
  if (!apiKey) {
    throw new Error("DUNE_API_KEY is not configured");
  }

  try {
    // Call Dune Echo API with metadata and spam filtering
    const url = new URL(
      `https://api.dune.com/api/echo/v1/balances/evm/${address}`
    );
    url.searchParams.append("metadata", "url,logo");
    url.searchParams.append("exclude_spam_tokens", "true");

    const response = await fetch(url.toString(), {
      headers: {
        "X-Dune-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Dune API error:", errorText);
      throw new ApiError(`Dune API error: ${response.statusText}`, errorText);
    }

    const data: DuneBalanceResponse = await response.json();

    if (data.errors) {
      throw new ApiError("Dune API error", data.errors);
    }

    // Format and sort response
    const balances = data.balances
      .filter((b) => !b.low_liquidity)
      .map((b) => buildTokenBalance(b))
      .sort((a, b) => {
        // Sort by value_usd descending, handling undefined values
        const aValue = a.value_usd ?? 0;
        const bValue = b.value_usd ?? 0;
        return bValue - aValue;
      });

    return {
      address,
      balances,
    };
  } catch (error) {
    console.error("Failed to fetch balances:", error);
    if (error instanceof ValidationError || error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Failed to fetch token balances", error);
  }
}
