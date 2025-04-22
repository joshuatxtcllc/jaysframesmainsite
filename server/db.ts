import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Log database connection status
if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️ DATABASE_URL environment variable is not set. " +
    "Database operations will not work until this is configured. " +
    "Please set the DATABASE_URL in your deployment environment."
  );
}

// Create pool only if we have a database URL
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log("✅ Database connection established successfully");
  }
} catch (error) {
  console.error("❌ Failed to establish database connection:", error);
}

// Export with fallbacks for when no database is available
export { pool, db };
