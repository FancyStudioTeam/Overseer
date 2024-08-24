import type { Role } from "oceanic.js";

declare global {
  // biome-ignore lint/style/useNamingConvention:
  namespace NodeJS {
    interface ProcessEnv {
      // biome-ignore lint/style/useNamingConvention:
      CLIENT_TOKEN: string;
      // biome-ignore lint/style/useNamingConvention:
      MONGO_DB_URL: string;
      // biome-ignore lint/style/useNamingConvention:
      SENTRY_DSN_URL: string;
    }
  }
}

declare module "oceanic.js" {
  interface Member {
    get highestRole(): Role;
  }

  interface User {
    get name(): string;
  }
}
