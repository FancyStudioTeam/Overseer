declare global {
  namespace NodeJS {
    interface ProcessEnv {
      Token: string;
      MongoDB: string;
      Environment: "DEVELOPMENT" | "PRODUCTION" | "MAINTENANCE";
      ReportsWebhookID: string;
      ReportsWebhookToken: string;
      LogsWebhookID: string;
      LogsWebhookToken: string;
      GuildLogsWebhookID: string;
      GuildLogsWebhookToken: string;
    }
  }
}

export {};
