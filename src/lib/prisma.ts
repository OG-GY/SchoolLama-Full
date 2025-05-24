// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Ensure this is only available in the global scope in development
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient if one doesn't already exist
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
