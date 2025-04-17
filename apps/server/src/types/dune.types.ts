// Dune Echo API response types
export interface DuneBalanceResponse {
  balances: DuneBalance[];
  wallet_address: string;
  errors?: any;
  next_offset?: string;
  request_time?: string;
  response_time?: string;
}

export interface DuneBalance {
  chain: string;
  chain_id: number;
  address: string;
  amount: string;
  symbol?: string;
  decimals?: number;
  name?: string;
}
