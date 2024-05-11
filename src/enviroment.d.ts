declare global {
  // biome-ignore lint/style/noNamespace:
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      MONGO_DB: string;
      SENTRY_DNS: string;
      LOGS_WEBHOOK: string;
      REPORTS_WEBHOOK: string;
    }
  }
}

export type {};
