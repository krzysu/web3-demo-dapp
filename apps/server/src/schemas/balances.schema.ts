import { z } from "zod";

// Request validation schema
export const balancesParamSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

// Response type
export interface TokenBalance {
  name: string;
  symbol: string;
  balance: string;
  chain: string;
}

export interface BalancesResponse {
  address: string;
  balances: TokenBalance[];
}
