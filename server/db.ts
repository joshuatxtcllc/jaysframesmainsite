
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import fs from 'fs';
import path from 'path';

neonConfig.webSocketConstructor = ws;

// Database connection state
let isDbConnected = false;

// Database URL configuration with production deployment support
let databaseUrl: string | undefined = process.env.DATABASE_URL;

// Try alternative environment variable names that might be set in production
if (!databaseUrl) {
  databaseUrl = process.env.POSTGRES_URL || 
               process.env.DB_URL || 
               process.env.NEON_DATABASE_URL ||
               process.env.PGURL;
}

// Handle missing DATABASE_URL with graceful degradation
if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is not set");
  console.log("Checking for production deployment environment variables...");
  
  // Check if individual postgres components are available
  const pgHost = process.env.PGHOST;
  const pgUser = process.env.PGUSER;
  const pgPassword = process.env.PGPASSWORD;
  const pgDatabase = process.env.PGDATABASE;
  const pgPort = process.env.PGPORT;
  
  if (pgHost && pgUser && pgPassword && pgDatabase) {
    databaseUrl = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort || 5432}/${pgDatabase}?sslmode=require`;
    console.log("Constructed DATABASE_URL from individual PostgreSQL environment variables");
  } else {
    console.warn("Unable to establish database connection - continuing without database");
    console.log("Application will run with limited functionality");
    
    // In development, provide setup instructions and exit
    if (process.env.NODE_ENV !== 'production' && !process.env.REPLIT_DEPLOYMENT) {
      console.log("\nDatabase Setup Instructions:");
      console.log("1. Go to the Database tab in Replit");
      console.log("2. Click 'Create a database'");
      console.log("3. The DATABASE_URL will be automatically set");
      console.log("4. Restart the application");
      process.exit(1);
    }
    
    // In production, continue without database to prevent deployment failure
    databaseUrl = undefined;
  }
}

// Set the constructed or found DATABASE_URL
if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
}

// Create pool and database connection with enhanced error handling
let pool: Pool | undefined;
let db: ReturnType<typeof drizzle> | undefined;

if (databaseUrl) {
  try {
    console.log("🔗 Connecting to PostgreSQL database...");
    console.log("Using DATABASE_URL:", databaseUrl.substring(0, 30) + "...");
    
    pool = new Pool({ 
      connectionString: databaseUrl,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 10
    });
    
    db = drizzle({ client: pool, schema });
    isDbConnected = true;
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Failed to establish database connection:", error);
    console.error("Database URL format check:", databaseUrl ? "Present" : "Missing");
    
    // In production, continue without database to prevent deployment failure
    if (process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT) {
      console.warn("Production deployment - continuing without database");
      pool = undefined;
      db = undefined;
      isDbConnected = false;
    } else {
      process.exit(1);
    }
  }
} else {
  console.warn("No database URL available - running without database");
  pool = undefined;
  db = undefined;
  isDbConnected = false;
}

// Run migrations on startup with error handling
async function runMigrations() {
  try {
    if (!pool) {
      console.warn("Database pool not available, skipping migrations");
      return;
    }
    
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
    if (process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT) {
      console.warn("Production environment - continuing without migrations");
      return;
    }
    throw error;
  }
}

// Initialize database with graceful error handling
async function initializeDatabase() {
  try {
    if (!pool || !db) {
      console.warn("Database connection not available, skipping initialization");
      return;
    }
    
    await runMigrations();
    console.log("🎉 Database initialization complete");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    
    // In production, don't exit to prevent deployment failures
    if (process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT) {
      console.warn("Production deployment - continuing with limited database functionality");
      return;
    }
    
    process.exit(1);
  }
}

// Safe initialization that won't crash in production
if (pool && db) {
  initializeDatabase().catch((error) => {
    console.error("Database initialization error:", error);
    if (process.env.NODE_ENV !== 'production' && !process.env.REPLIT_DEPLOYMENT) {
      process.exit(1);
    }
  });
} else {
  console.warn("Database not properly initialized - running in limited mode");
}

export { pool, db, isDbConnected };
