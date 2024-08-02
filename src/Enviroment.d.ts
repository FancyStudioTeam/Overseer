declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_TOKEN: string;
      MONGO_DB_URL: string;
      SENTRY_DSN_URL: string;
    }
  }
}

declare module "oceanic.js" {
  interface User {
    get name(): string;
  }
}

export type {};
