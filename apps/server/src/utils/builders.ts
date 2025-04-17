import type { TokenBalance } from "../schemas/balances.schema.js";
import type { DuneBalance } from "../types/dune.types.js";

export function buildTokenBalance(b: DuneBalance): TokenBalance {
  return {
    name: b.name || "",
    symbol: b.symbol || "",
    balance: b.amount,
    chain: b.chain,
    decimals: b.decimals,
    value_usd: b.value_usd,
    token_metadata: b.token_metadata || {},
  };
}
