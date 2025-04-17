// Dune Echo API response types
export interface DuneBalanceResponse {
  balances: DuneBalance[];
  wallet_address: string;
  errors?: any;
  next_offset?: string;
  request_time?: string;
  response_time?: string;
}

interface TokenMetadata {
  logo?: string;
  url?: string;
}

export interface DuneBalance {
  chain: string;
  chain_id: number;
  address: string;
  amount: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  price_usd?: number;
  value_usd?: number;
  token_metadata?: TokenMetadata;
  pool_size: number;
  low_liquidity?: boolean;
}
