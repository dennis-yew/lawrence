import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create PostgreSQL connection client with retry logic
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, {
  max: 1,
  connect_timeout: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

// Create drizzle instance using the client and schema
export const db = drizzle(client, { schema });

// Test database connection
export const testConnection = async () => {
  try {
    await client`SELECT 1`;
    console.log("Database connection successful");
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};
