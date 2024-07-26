import { captureException } from "@sentry/node";
import { LoggerType, logger } from "#util/Util.js";

process.on("unhandledRejection", (error: Error) => {
  captureException(error);
  logger(LoggerType.ERROR, `Unhandled Rejection: ${error.stack ?? error.message}`);
});
