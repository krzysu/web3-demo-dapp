import { z } from "zod";
import type { User } from "../db/schema.js";

export const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
});

export type LeaderboardQueryParams = z.infer<typeof leaderboardQuerySchema>;

export type LeaderboardResponse = {
  entries: User[];
  total: number;
  limit: number;
  offset: number;
};
