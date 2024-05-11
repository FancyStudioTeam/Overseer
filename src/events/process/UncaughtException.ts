import { captureException } from "@sentry/node";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

process.on("uncaughtException", (_error: Error) => {
  captureException(_error);
  logger(
    LoggerType.ERROR,
    `Uncaught Exception: ${_error.stack ?? _error.message}`
  );
});
