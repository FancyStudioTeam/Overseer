import { execSync } from "node:child_process";

execSync("npm run prisma:generate && npm run start", {
  stdio: "inherit",
});
