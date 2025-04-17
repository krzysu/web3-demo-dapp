import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.js";

// Initialize SQLite database
const sqlite = new Database("local.db");

// Create Drizzle ORM instance
export const db = drizzle(sqlite, { schema });
