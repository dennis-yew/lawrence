import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create PostgreSQL connection client
const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString);

// Create drizzle instance using the client and schema
export const db = drizzle(client, { schema });