import type { DuneBalanceResponse } from "../types/dune.types.js";
import type { BalancesResponse } from "../schemas/balances.schema.js";
import { ValidationError, ApiError } from "../utils/errors.js";

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
    // Call Dune Echo API
    const response = await fetch(
      `https://api.dune.com/api/echo/v1/balances/evm/${address}`,
      {
        headers: {
          "X-Dune-Api-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Dune API error:", errorText);
      throw new ApiError(`Dune API error: ${response.statusText}`, errorText);
    }

    const data: DuneBalanceResponse = await response.json();

    if (data.errors) {
      throw new ApiError("Dune API error", data.errors);
    }

    // Format response
    return {
      address,
      balances: data.balances
        .filter((b) => b.symbol && b.name) // Only include tokens with symbol and name
        .map((b) => ({
          name: b.name || "",
          symbol: b.symbol || "",
          balance: b.amount,
          chain: b.chain,
        })),
    };
  } catch (error) {
    console.error("Failed to fetch balances:", error);
    if (error instanceof ValidationError || error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Failed to fetch token balances", error);
  }
}
