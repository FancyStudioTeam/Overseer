import { captureException } from "@sentry/node";
import { LoggerType, logger } from "#util/Util.js";

process.on("uncaughtException", (error: Error) => {
  captureException(error);
  logger(LoggerType.ERROR, `Uncaught Exception: ${error.stack ?? error.message}`);
});
