import { logger } from "@util/logger.js";

process.on("uncaughtException", (error) => logger.error(error.stack));
