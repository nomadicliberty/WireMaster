import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use a fallback URL for development
const dbUrl = process.env.DATABASE_URL || (process.env.NODE_ENV === 'development' 
  ? 'postgres://postgres:postgres@localhost:5432/dev'
  : undefined);

if (!dbUrl) {
  console.error("DATABASE_URL environment variable is not set in production");
  // Don't exit in production to avoid crash loops
  pool = null;
  db = null;
} else {
  try {
    pool = new Pool({ connectionString: dbUrl });
    db = drizzle(pool, { schema });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    pool = null;
    db = null;
  }
}

export { pool, db };