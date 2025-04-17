import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createAuthToken, verifySignature } from "./handlers/auth.handler.js";
import { AuthError, ValidationError } from "./utils/errors.js";
import { authSchema } from "./schemas/auth.schema.js";
import type { AuthResponse } from "./schemas/auth.schema.js";

const app = new Hono();

// Error handling middleware
app.use("*", async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ValidationError || error instanceof AuthError) {
      c.status(error.status);
      return c.json({
        error: {
          type: error.type,
          message: error.message,
          details: error.details,
        },
      });
    }

    console.error("Unhandled error:", error);
    c.status(500);
    return c.json({
      error: {
        type: "SERVER_ERROR",
        message: "Internal server error",
      },
    });
  }
});

// Auth endpoint
app.post("/auth", zValidator("json", authSchema), async (c) => {
  const data = c.req.valid("json");

  await verifySignature(data);
  const token = createAuthToken(data.address);

  const response: AuthResponse = {
    token,
    address: data.address,
  };

  return c.json(response);
});

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
