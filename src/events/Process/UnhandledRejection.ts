import { captureException } from "@sentry/node";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

process.on("unhandledRejection", (_error: Error) => {
  captureException(_error);
  logger(
    LoggerType.ERROR,
    `Unhandled Rejection: ${_error.stack ?? _error.message}`
  );
});