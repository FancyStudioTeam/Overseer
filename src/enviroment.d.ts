declare global {
  // biome-ignore lint/style/noNamespace:
  namespace NodeJS {
    interface ProcessEnv {
      Token: string;
      MongoDB: string;
      Environment: "DEVELOPMENT" | "PRODUCTION" | "MAINTENANCE";
      LogsWebhook: string;
      ReportsWebhook: string;
    }
  }
}

export type {};
