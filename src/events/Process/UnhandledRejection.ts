import { captureException } from "@sentry/node";
import { LoggerType, logger } from "#util/Util.js";

process.on("unhandledRejection", (error) => {
  captureException(error);

  if (error instanceof Error) {
    logger(LoggerType.ERROR, `Unhandled Rejection: ${error.stack ?? error.message}`);
  }
});
