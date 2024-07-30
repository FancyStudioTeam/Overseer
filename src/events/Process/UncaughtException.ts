import { captureException } from "@sentry/node";
import { LoggerType, logger } from "#util/Util.js";

process.on("uncaughtException", (error) => {
  captureException(error);
  logger({
    content: `Uncaught Exception: ${error.stack ?? error.message}`,
    type: LoggerType.ERROR,
  });
});
