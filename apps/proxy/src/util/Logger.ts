import { addColors, createLogger, format, transports } from "winston";

const loggerLevels = {
  colors: {
    debug: "blue",
    error: "red",
    http: "magenta",
    info: "green",
    silly: "grey",
    verbose: "cyan",
    warn: "yellow",
  },
  levels: {
    debug: 5,
    error: 0,
    http: 3,
    info: 2,
    silly: 6,
    verbose: 4,
    warn: 1,
  },
};

addColors(loggerLevels.colors);

const sharedFileTransportFormat = format.combine(
  format.timestamp({
    format: "DD/MM/YYYY HH:mm:ss",
  }),
  format.json(),
);
const sharedFileTransportOptions = ({
  fileName,
  maxSize,
}: ShardFileTransportOptions): transports.FileTransportOptions => ({
  dirname: "logs",
  filename: fileName,
  format: sharedFileTransportFormat,
  maxsize: maxSize,
});

export const logger = createLogger({
  level: "silly",
  levels: loggerLevels.levels,
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({
          format: "DD/MM/YYYY HH:mm:ss",
        }),
        format((info) => {
          const formatedLevel = info.level.toUpperCase();
          const formattedMessage =
            typeof info.message === "object" ? JSON.stringify(info.message, null, 2) : info.message;

          info.level = formatedLevel;
          info.message = formattedMessage;

          return info;
        })(),
        format.colorize({
          level: true,
        }),
        format.align(),
        format.printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`),
      ),
    }),
    new transports.File({
      ...sharedFileTransportOptions({
        fileName: "errors.log",
        maxSize: 78_643_200,
      }),
      level: "error",
    }),
    new transports.File(
      sharedFileTransportOptions({
        fileName: "all.log",
        maxSize: 262_144_000,
      }),
    ),
  ],
});

interface ShardFileTransportOptions {
  fileName: string;
  maxSize: number;
}
