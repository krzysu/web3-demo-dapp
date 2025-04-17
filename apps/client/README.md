# Web3 Demo dApp Client

A modern web3 demonstration application built with Next.js and TypeScript that allows users to connect their wallets, view token balances across different chains, and participate in a leaderboard system.

## Features

- **Wallet Integration**: Seamless wallet connection using wagmi
- **Token Balances Display**:
  - View token balances across different chains
  - Real-time USD value conversion
  - Token metadata display with logos
- **Leaderboard System**:
  - Add wallet addresses to the leaderboard
  - Authentication system for verified entries
- **Modern UI**:
  - Responsive design with Tailwind CSS
  - Dark mode support
  - Loading states and error handling

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**:
  - connectkit + wagmi for wallet connections
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Custom components with dark mode support

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Start the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## Build

To create a production build:

```bash
yarn build
```

To start the production server:

```bash
yarn start
```
