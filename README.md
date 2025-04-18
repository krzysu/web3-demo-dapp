# Web3 Demo dApp

A full-stack EVM-based web application demonstrating wallet integration, token balances tracking, and a global leaderboard feature.

## Project Structure

This is a TypeScript monorepo containing:

- `apps/client`: Next.js static generated frontend application with Tailwind CSS
- `apps/server`: Express.js backend with SQLite database

## Features

- 🔑 Secure wallet connection and authentication
- 💰 Token balance display
- 🏆 Global leaderboard with registered users
- 🔒 Signature-based authentication
- 🎨 Responsive UI
- 🌙 Automatic dark mode based on system preferences

## Technology Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- connectkit + wagmi for wallet integration

### Backend

- Express.js with TypeScript
- SQLite with Drizzle ORM
- viem for Ethereum interactions
- zod for request validation

## Local Development Setup

### Prerequisites

- Node.js 20+
- yarn
- An Ethereum wallet (e.g., MetaMask)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd web3-demo-dapp
```

2. Install dependencies:

```bash
yarn install
```

3. Setup environment variables:

To fetch wallet balances, you’ll need a Dune Echo API key, which you can create for free at [dune.com/settings/api](dune.com/settings/api).

Then, create a `.env` file inside the `apps/server` directory and add the required environment variables.

```bash
cp apps/server/.env.example apps/server/.env
# Fill in required variables
```

4. Setup database:

```bash
yarn server:db:migrate
```

### Running Tests

To run server tests, use the following command:

```bash
yarn server:test
```

### Running the Application

1. Start the backend server:

```bash
yarn server:dev
```

2. Start the frontend application:

```bash
yarn client:dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Some Design Decisions

- **Live API Usage in Tests**: Server tests for the `/balances` endpoint currently run against real third-party API without mocking. While acceptable for a small number of tests, this approach should be used sparingly. For broader or more complex test coverage, mocks should be implemented.

- **Database Initialization in Tests**: Database setup in tests should rely on the ORM schema to ensure consistency.

- **Shared Types**: Request and response types used in backend endpoints should be reused between the client and server via a shared package. This promotes type safety, reduces duplication, and minimizes potential inconsistencies.

- **UI Styling Approach**: Since the project specification did not mandate a specific component library, I opted to use Tailwind CSS utility classes for styling. For projects with more advanced UI requirements, adopting a component library such as MUI, Chakra UI, or `shadcn/ui` (for a more customizable, Tailwind-friendly approach) would be beneficial.

- **Dependency Versions**: Some dependencies may not be the latest available. Updating them should be considered as a follow-up to ensure access to the newest features, improvements, and security patches.

- **AI Assistance**: The project was built with the help of an AI coding assistant to accelerate development and explore different implementation options. However, all code, features, and design decisions were thoroughly reviewed, refined, and validated by the author to ensure quality and correctness.

## License

MIT © [Kris Urbas](https://twitter.com/krzysu)
