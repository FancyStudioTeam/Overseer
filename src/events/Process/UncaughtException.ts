import { captureException } from "@sentry/node";
import { LoggerType, logger } from "#util";

process.on("uncaughtException", (_error: Error) => {
    captureException(_error);
    logger(LoggerType.ERROR, `Uncaught Exception: ${_error.stack ?? _error.message}`);
});
