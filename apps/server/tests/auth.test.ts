import { describe, it, expect } from "vitest";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import request from "supertest";

// Import app after environment variables are loaded
import { app } from "../src/index.js";

describe("POST /auth", () => {
  // Test private key (never use this in production!)
  const testPrivateKey =
    "0x1234567890123456789012345678901234567890123456789012345678901234";
  const account = privateKeyToAccount(testPrivateKey);
  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
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
