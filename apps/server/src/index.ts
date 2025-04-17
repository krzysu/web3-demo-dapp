import * as dotenv from "dotenv";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

import { AuthError, ValidationError, ApiError } from "./utils/errors.js";
import { createAuthToken, verifySignature } from "./handlers/auth.handler.js";
import { getTokenBalances } from "./handlers/balances.handler.js";
import { type AuthResponse, authSchema } from "./schemas/auth.schema.js";
import { balancesParamSchema } from "./schemas/balances.schema.js";

// Load environment variables
dotenv.config();

// Create Express app
export const app = express();

// Parse JSON bodies
app.use(express.json());

// Zod validation middleware
const validateBody = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(new ValidationError("Invalid request body", error));
    }
  };
};

const validateParams = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      next(new ValidationError("Invalid request parameters", error));
    }
  };
};

// Auth endpoint
app.post(
  "/auth",
  validateBody(authSchema),
  asyncHandler(async (req: Request, res: Response) => {
    await verifySignature(req.body);
    const token = createAuthToken(req.body.address);

    const response: AuthResponse = {
      token,
      address: req.body.address,
    };

    res.json(response);
  })
);

// Token balances endpoint
app.get(
  "/balances/:address",
  validateParams(balancesParamSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { address } = req.params;
    const result = await getTokenBalances(address);
    res.json(result);
  })
);

// Start the server
const port = Number(process.env.PORT) || 3001;

// Error handling middleware - must be after all routes
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (
    err instanceof ValidationError ||
    err instanceof AuthError ||
    err instanceof ApiError
  ) {
    return res.status(err.status).json({
      error: {
        type: err.type,
        message: err.message,
        details: err.details,
      },
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    error: {
      type: "SERVER_ERROR",
      message: "Internal server error",
    },
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
