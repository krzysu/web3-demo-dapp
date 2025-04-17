import { describe, it, expect, beforeAll } from "vitest";
import * as dotenv from "dotenv";
import request from "supertest";

// Load environment variables first
dotenv.config();

// Import app after environment variables are loaded
import { app } from "../src/index.js";

describe("GET /balances/:address", () => {
  beforeAll(() => {
    // Ensure DUNE_API_KEY is set
    if (!process.env.DUNE_API_KEY) {
      throw new Error(
        "DUNE_API_KEY environment variable must be set for balance tests"
      );
    }
  });

  it("should return balances for valid address", async () => {
    // Use Vitalik's address for testing
    const testAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

    const res = await request(app).get(`/balances/${testAddress}`);

    expect(res.status).toBe(200);
    const data = res.body;

    expect(data).toEqual({
      address: testAddress,
      balances: expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          symbol: expect.any(String),
          balance: expect.any(String),
          chain: expect.any(String),
        }),
      ]),
    });
  });

  it("should return 400 for invalid address format", async () => {
    const invalidAddress = "not-an-address";

    const res = await request(app).get(`/balances/${invalidAddress}`);

    expect(res.status).toBe(400);
    const data = res.body;
    expect(data.error).toBeDefined();
    expect(data.error.type).toBe("VALIDATION_ERROR");
  });
});
