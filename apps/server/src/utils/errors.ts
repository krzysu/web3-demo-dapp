import type { StatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  constructor(
    public type: string,
    message: string,
    public status: StatusCode,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message: string, details?: unknown) {
    super("AUTH_ERROR", message, 401, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super("VALIDATION_ERROR", message, 400, details);
  }
}
