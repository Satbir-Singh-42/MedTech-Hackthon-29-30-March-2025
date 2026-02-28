import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠  DATABASE_URL not set. Drizzle Kit commands (db:push) require it.\n" +
      "   Copy .env.example to .env and set DATABASE_URL to your PostgreSQL connection string.",
  );
  process.exit(1);
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
