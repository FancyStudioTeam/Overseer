import { execSync } from "node:child_process";

execSync("npm run prisma:generate & node dist/index.js", {
  stdio: "inherit",
});
