import { verifyMessage } from "viem";
import { AuthError, ValidationError } from "../utils/errors.js";
import type { AuthRequestValidated } from "../schemas/auth.schema.js";

/**
 * Verifies an Ethereum signature
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
export function createAuthToken(address: string): string {
  // For demo purposes, just return the address as a token
  // In production, use proper JWT or session management
  return `auth_${address.toLowerCase()}`;
}
