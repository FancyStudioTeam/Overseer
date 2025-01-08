import { execSync } from "node:child_process";

execSync("SET NODE_ENV=production && npm run prisma:generate && npm run start", {
  stdio: "inherit",
});
