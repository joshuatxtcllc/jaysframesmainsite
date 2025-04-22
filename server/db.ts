
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Set a default in-memory database URL if none is provided
if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️ DATABASE_URL environment variable is not set. " +
    "Using in-memory database instead. " +
    "Set DATABASE_URL in your deployment environment for persistent storage."
  );
  process.env.DATABASE_URL = "memory://jaysframes";
}

// Create pool and database connection
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

try {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
  console.log("✅ Database connection established successfully");
} catch (error) {
  console.error("❌ Failed to establish database connection:", error);
}

// Export with fallbacks for when no database is available
export { pool, db };
