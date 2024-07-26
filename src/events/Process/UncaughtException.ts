import { captureException } from "@sentry/node";
import { LoggerType, logger } from "#util/Util.js";

process.on("uncaughtException", (error) => {
  captureException(error);
  logger(LoggerType.ERROR, `Uncaught Exception: ${error.stack ?? error.message}`);
});
