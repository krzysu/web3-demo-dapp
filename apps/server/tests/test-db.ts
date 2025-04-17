import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import type { Address } from "viem";
import * as schema from "../src/db/schema.js";
import { users } from "../src/db/schema.js";

export function createTestDb() {
  // Create in-memory database
  const sqlite = new Database(":memory:");

  // Create Drizzle instance
  const db = drizzle(sqlite, { schema });

  // Initialize schema
  // TODO: use the same schema as the main app
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      address TEXT PRIMARY KEY,
      first_auth INTEGER NOT NULL,
      last_auth INTEGER NOT NULL,
      auth_count INTEGER NOT NULL DEFAULT 1
    );
  `);

  return { db, sqlite };
}

export const testUsers = [
  {
    address: "0x1234567890123456789012345678901234567890" as Address,
    firstAuth: new Date("2024-01-01"),
    lastAuth: new Date("2024-01-02"),
    authCount: 5,
  },
  {
    address: "0x2345678901234567890123456789012345678901" as Address,
    firstAuth: new Date("2024-01-03"),
    lastAuth: new Date("2024-01-04"),
    authCount: 3,
  },
  {
    address: "0x3456789012345678901234567890123456789012" as Address,
    firstAuth: new Date("2024-01-05"),
    lastAuth: new Date("2024-01-06"),
    authCount: 7,
  },
];

export async function seedTestData(db: ReturnType<typeof createTestDb>["db"]) {
  for (const user of testUsers) {
    await db.insert(users).values({
      address: user.address,
      firstAuth: user.firstAuth,
      lastAuth: user.lastAuth,
      authCount: user.authCount,
    });
  }
}

export async function clearTestData(db: ReturnType<typeof createTestDb>["db"]) {
  await db.delete(users);
}
