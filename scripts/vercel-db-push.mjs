import { spawnSync } from "node:child_process";

if (process.env.VERCEL !== "1" || !process.env.DATABASE_URL) {
  console.log("Skipping Prisma db push outside Vercel.");
  process.exit(0);
}

console.log("Applying Prisma schema to the production database...");

const result = spawnSync("npx", ["prisma", "db", "push", "--skip-generate"], {
  env: process.env,
  stdio: "inherit"
});

process.exit(result.status ?? 1);
