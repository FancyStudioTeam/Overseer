import type { Role } from "oceanic.js";

declare module "oceanic.js" {
  interface Member {
    get highestRole(): Role;
  }

  interface User {
    get name(): string;
  }
}
