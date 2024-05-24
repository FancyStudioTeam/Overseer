import { captureException } from "@sentry/node";
import { LoggerType, logger } from "../../util/Util";

process.on("unhandledRejection", (_error: Error) => {
  captureException(_error);
  logger(
    LoggerType.ERROR,
    `Unhandled Rejection: ${_error.stack ?? _error.message}`,
  );
});
