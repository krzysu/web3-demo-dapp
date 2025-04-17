import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: "local.db",
  },
} satisfies Config;
