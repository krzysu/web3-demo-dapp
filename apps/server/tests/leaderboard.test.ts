import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/index.js";
import {
  createTestDb,
  seedTestData,
  clearTestData,
  testUsers,
} from "./test-db.js";
import type { Address } from "viem";
import type { LeaderboardResponse } from "../src/schemas/leaderboard.schema.js";

describe("GET /leaderboard", () => {
  let testDb: ReturnType<typeof createTestDb>;

  beforeAll(() => {
    testDb = createTestDb();
    app.locals.db = testDb.db;
  });

  beforeEach(async () => {
    await clearTestData(testDb.db);
    await seedTestData(testDb.db);
  });

  afterAll(() => {
    testDb.sqlite.close();
  });

  it("should return paginated leaderboard data sorted by auth count", async () => {
    const res = await request(app).get("/leaderboard");

    expect(res.status).toBe(200);
    const data = res.body as LeaderboardResponse;

    // Verify pagination defaults
    expect(data.limit).toBe(10);
    expect(data.offset).toBe(0);
    expect(data.total).toBe(3); // Total number of test users

    // Verify entries are sorted by authCount desc
    expect(data.entries).toHaveLength(3);
    expect(data.entries[0].authCount).toBe(7); // Highest auth count first
    expect(data.entries[0].address as Address).toBe(testUsers[2].address);
    expect(data.entries[1].authCount).toBe(5);
    expect(data.entries[2].authCount).toBe(3);

    // Verify entry structure
    const entry = data.entries[0];
    expect(entry).toHaveProperty("address");
    expect(entry).toHaveProperty("authCount");
    expect(entry).toHaveProperty("firstAuth");
    expect(entry).toHaveProperty("lastAuth");
  });

  it("should respect limit and offset parameters", async () => {
    const res = await request(app)
      .get("/leaderboard")
      .query({ limit: 2, offset: 1 });

    expect(res.status).toBe(200);
    const data = res.body as LeaderboardResponse;

    // Verify pagination params are respected
    expect(data.limit).toBe(2);
    expect(data.offset).toBe(1);
    expect(data.total).toBe(3);

    // Verify we get correct slice of data
    expect(data.entries).toHaveLength(2);
    expect(data.entries[0].authCount).toBe(5); // Second highest auth count
    expect(data.entries[1].authCount).toBe(3); // Third highest auth count
  });

  it("should return empty entries array when offset exceeds total", async () => {
    const res = await request(app).get("/leaderboard").query({ offset: 10 });

    expect(res.status).toBe(200);
    const data = res.body as LeaderboardResponse;

    expect(data.total).toBe(3);
    expect(data.entries).toHaveLength(0);
  });
});
