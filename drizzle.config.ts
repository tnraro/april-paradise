import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/data/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.PG_URL as string,
  },
  verbose: true,
  strict: true,
});
