import { desc, sql } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { Address } from "viem";

import { users } from "../db/schema.js";
import { ValidationError } from "../utils/errors.js";
import type {
  LeaderboardQueryParams,
  LeaderboardResponse,
} from "../schemas/leaderboard.schema.js";
import type * as schema from "../db/schema.js";

type DB = BetterSQLite3Database<typeof schema>;

/**
 * Fetches the leaderboard data with pagination
 * @throws {ValidationError} If the query parameters are invalid
 */
export async function getLeaderboard(
  params: LeaderboardQueryParams,
  db: DB
): Promise<LeaderboardResponse> {
  // Validate input
  if (params.limit < 1 || params.limit > 100) {
    throw new ValidationError("Limit must be between 1 and 100");
  }
  if (params.offset < 0) {
    throw new ValidationError("Offset must be non-negative");
  }

  // Get total count of users
  const result = db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .all();

  const count = result[0]?.count ?? 0;

  // Get paginated user data sorted by auth_count desc, first_auth asc
  const entries = db
    .select()
    .from(users)
    .orderBy(desc(users.authCount), users.firstAuth)
    .limit(params.limit)
    .offset(params.offset)
    .all();

  return {
    entries: entries.map((entry) => ({
      address: entry.address as Address,
      authCount: entry.authCount,
      firstAuth: new Date(entry.firstAuth),
      lastAuth: new Date(entry.lastAuth),
    })),
    total: count,
    limit: params.limit,
    offset: params.offset,
  };
}
