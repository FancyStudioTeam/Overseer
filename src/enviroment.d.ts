declare global {
  namespace NodeJS {
    interface ProcessEnv {
      Token: string;
      MongoDB: string;
      Environment: "DEVELOPMENT" | "PRODUCTION" | "MAINTENANCE";
      LogsWebhook: string;
      ReportsWebhook: string;
      TopGGToken: string;
    }
  }
}

export type {};
