import { customType, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import type { Address } from "viem";

// Custom type for viem Address
const addressType = customType<{ data: Address; driverData: string }>({
  dataType() {
    return "text";
  },
  fromDriver(value: string): Address {
    return value as Address;
  },
});

export const users = sqliteTable("users", {
  address: addressType("address").primaryKey(),
  firstAuth: integer("first_auth", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  lastAuth: integer("last_auth", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  authCount: integer("auth_count").notNull().default(1),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
