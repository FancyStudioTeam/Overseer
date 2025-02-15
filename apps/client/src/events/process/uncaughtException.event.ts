import { logger } from "@util/logger.js";

process.on("uncaughtException", ({ stack }) => logger.error("Uncaught Exception: ", stack));
