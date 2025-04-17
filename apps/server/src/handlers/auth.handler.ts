import { type Address, verifyMessage } from "viem";
import { eq, sql } from "drizzle-orm";
import { AuthError, ValidationError } from "../utils/errors.js";
import type { AuthRequestValidated } from "../schemas/auth.schema.js";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";

/**
 * Updates or creates a user record in the database
 */
async function updateUserAuth(address: Address): Promise<void> {
  const now = new Date();

  // Try to update existing user
  const updated = db
    .update(users)
    .set({
      lastAuth: now,
      authCount: sql`${users.authCount} + 1`,
    })
    .where(eq(users.address, address))
    .run();

  // If user doesn't exist, create new record
  if (!updated.changes) {
    db.insert(users)
      .values({
        address,
        firstAuth: now,
        lastAuth: now,
        authCount: 1,
      })
      .run();
  }
}

/**
 * Verifies an Ethereum signature and records the authentication
 * @throws {ValidationError} If the request data is invalid
 * @throws {AuthError} If the signature verification fails
 */
export async function verifySignature(
  data: AuthRequestValidated
): Promise<boolean> {
  // Validate input data
  if (!data.message || !data.signature || !data.address) {
    throw new ValidationError("Missing required fields");
  }

  try {
    // Verify the signature
    const isValid = await verifyMessage({
      message: data.message,
      signature: data.signature,
      address: data.address,
    });

    if (!isValid) {
      throw new AuthError("Invalid signature");
    }

    // Record successful authentication
    await updateUserAuth(data.address);

    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Signature verification failed", error);
  }
}

/**
 * Creates a simple auth token
 * In a real application, this would be a proper JWT or session token
 */
export function createAuthToken(address: Address): string {
  // For demo purposes, just return the address as a token
  // In production, use proper JWT or session management
  return `auth_${address.toLowerCase()}`;
}
