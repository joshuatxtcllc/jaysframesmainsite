
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import fs from 'fs';
import path from 'path';

neonConfig.webSocketConstructor = ws;

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL environment variable is not set. " +
    "Please set up PostgreSQL database in Replit."
  );
  process.exit(1);
}

console.log("🔗 Connecting to PostgreSQL database...");

// Create pool and database connection
let pool: Pool;
let db: ReturnType<typeof drizzle>;

try {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
  console.log("✅ Database connection established successfully");
} catch (error) {
  console.error("❌ Failed to establish database connection:", error);
  process.exit(1);
}

// Run migrations on startup
async function runMigrations() {
  try {
    console.log("🔄 Running database migrations...");
    
    const migrationPath = path.join(process.cwd(), 'server/migrations/0001_initial_schema.sql');
    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Execute the migration
      const client = await pool.connect();
      try {
        await client.query(migrationSQL);
        console.log("✅ Database migrations completed successfully");
      } finally {
        client.release();
      }
    } else {
      console.log("ℹ️ No migration files found, skipping migrations");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Initialize database
async function initializeDatabase() {
  try {
    await runMigrations();
    console.log("🎉 Database initialization complete");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();

export { pool, db };
