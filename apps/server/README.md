# Web3 Demo Server

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Set up the database:

```bash
yarn db:generate  # Generate migration files
yarn db:push     # Apply migrations
```

3. Start the development server:

```bash
yarn dev
```

4. (Optional) Open database studio:

```bash
yarn db:studio
```

## API Endpoints

### Authentication

```
POST /auth
```

Verifies Ethereum signatures and tracks user authentication.

Request body:

```json
{
  "message": "Login to Web3 Demo",
  "signature": "0x...",
  "address": "0x..."
}
```

Response:

```json
{
  "token": "auth_0x...",
  "address": "0x..."
}
```

### Token Balances

```
GET /balances/:address
```

Fetches token balances for an Ethereum address using Dune Echo API.

Parameters:

- `address`: Ethereum address to fetch balances for (e.g., `/balances/0x123...`)

Response:

```json
{
  "address": "0x...",
  "balances": [
    {
      "name": "Ethereum",
      "symbol": "ETH",
      "balance": "1.5",
      "chain": "ethereum"
    }
  ]
}
```

Note: Requires `DUNE_API_KEY` environment variable to be set.

### Leaderboard

```
GET /leaderboard
```

Returns authenticated users sorted by their authentication count.

Query parameters:

- `limit` (optional): Number of entries to return (default: 10, max: 100)
- `offset` (optional): Number of entries to skip (default: 0)

Response:

```json
{
  "entries": [
    {
      "address": "0x...",
      "authCount": 5,
      "firstAuth": "2024-04-17T10:25:00.000Z",
      "lastAuth": "2024-04-17T10:30:00.000Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```
