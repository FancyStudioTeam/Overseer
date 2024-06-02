declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            MONGO_DB: string;
            SENTRY_DNS: string;
            GITHUB_TOKEN: string;
            LOGS_WEBHOOK: string;
            REPORTS_WEBHOOK: string;
        }
    }
}

export type {};
