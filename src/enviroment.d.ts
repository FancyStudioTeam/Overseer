declare global {
  // biome-ignore lint/style/noNamespace:
  namespace NodeJS {
    interface ProcessEnv {
      Token: string;
      MongoDB: string;
      LogsWebhook: string;
      ReportsWebhook: string;
    }
  }
}

export type {};
