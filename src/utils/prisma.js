import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  // Fail fast with a clear message when env config is missing.
  throw new Error("DATABASE_URL is not set. Add it to your .env file.");
}

// Prisma 7 + engineType "client" requires a driver adapter.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Create one Prisma client instance for the app to reuse.
const prisma = new PrismaClient({ adapter });

export default prisma;
