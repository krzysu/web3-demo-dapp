import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import request from "supertest";

import { app } from "../src/index.js";
import { createTestDb, clearTestData } from "./test-db.js";

describe("POST /auth", () => {
  let testDb: ReturnType<typeof createTestDb>;

  // Test private key (never use this in production!)
  const testPrivateKey =
    "0x1234567890123456789012345678901234567890123456789012345678901234";
  const account = privateKeyToAccount(testPrivateKey);
  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  });

  beforeAll(() => {
    testDb = createTestDb();
    app.locals.db = testDb.db;
  });

  beforeEach(async () => {
    await clearTestData(testDb.db);
  });

  afterAll(() => {
    testDb.sqlite.close();
  });

  it("should validate request and return auth token", async () => {
    const message = "Sign in to Web3 Demo Dapp";
    const signature = await walletClient.signMessage({ message });

    const res = await request(app).post("/auth").send({
      address: account.address,
      signature,
      message,
    });

    expect(res.status).toBe(200);
    const data = res.body;
    expect(data).toEqual({
      token: `auth_${account.address.toLowerCase()}`,
      address: account.address,
    });
  });

  it("should return 400 for invalid signature", async () => {
    const message = "Sign in to Web3 Demo Dapp";
    const invalidSignature = "0x1234"; // Invalid signature

    const res = await request(app).post("/auth").send({
      address: account.address,
      signature: invalidSignature,
      message,
    });

    expect(res.status).toBe(400);
  });
});
