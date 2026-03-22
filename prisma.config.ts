import "dotenv/config";
// 1. Add 'env' to your import
import { defineConfig, env } from "prisma/config"; 

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 2. Use Prisma's env() helper instead of process.env
    url: env("DIRECT_URL"), 
  },
});