import winston from "winston";
import { formatTimestamp } from "./util";

const config = {
  levels: {
    ERR: 0,
    DBG: 1,
    WRN: 2,
    INF: 3,
    REQ: 4,
  },
  colors: {
    ERR: "red",
    DBG: "magenta",
    WRN: "yellow",
    INF: "blue",
    REQ: "cyan",
  },
};

winston.addColors(config.colors);

export const logger = winston.createLogger({
  levels: config.levels,
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${formatTimestamp(
        timestamp,
        "Europe/Madrid",
        true
      )}] [${level}] ${message}`;
    })
  ),
  level: "REQ",
});
