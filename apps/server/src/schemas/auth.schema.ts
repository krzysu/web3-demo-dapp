import { z } from "zod";
import type { Address, Hex } from "viem";

export const authSchema = z.object({
  message: z.string().min(1),
  signature: z
    .string()
    .regex(/^0x[a-fA-F0-9]{130}$/)
    .transform((val): Hex => val as Hex),
  address: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .transform((val): Address => val as Address),
});

// Raw input type before transformation
export type AuthRequestInput = {
  message: string;
  signature: string;
  address: string;
};

// Transformed type after Zod validation
export type AuthRequestValidated = z.infer<typeof authSchema>;

// Response type
export type AuthResponse = {
  token: string;
  address: Address;
};
