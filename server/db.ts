import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let db: ReturnType<typeof drizzle> | null = null;
let pool: Pool | null = null;

export function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL found - using memory storage");
    return null;
  }

  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log("PostgreSQL database connected successfully");
    return db;
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    console.log("Falling back to memory storage");
    return null;
  }
}

export { db, pool };