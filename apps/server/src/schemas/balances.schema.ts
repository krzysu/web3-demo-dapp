import { z } from "zod";

// Request validation schema
export const balancesParamSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

interface TokenMetadata {
  logo?: string;
}

// Response type
export interface TokenBalance {
  name: string;
  symbol: string;
  balance: string;
  chain: string;
  decimals?: number;
  value_usd?: number;
  token_metadata: TokenMetadata;
}

export interface BalancesResponse {
  address: string;
  balances: TokenBalance[];
}
