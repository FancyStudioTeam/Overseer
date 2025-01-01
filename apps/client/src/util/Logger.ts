import { addColors, createLogger, format, transports } from "winston";

const loggerLevelsConfig = {
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
const { colors, levels } = loggerLevelsConfig;

addColors(colors);

const baseFormat = format.combine(
  format.timestamp({
    format: "DD/MM/YYYY HH:mm:ss",
  }),
  format((info) => {
    const formatedLevel = info.level.toUpperCase();
    const formattedMessage = typeof info.message === "object" ? JSON.stringify(info.message, null, 2) : info.message;

    info.level = formatedLevel;
    info.message = formattedMessage;

    return info;
  })(),
);
const messageFormat = format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level} ${message}`);

const sharedFileTransportOptions = ({
  fileName,
  maxSize,
}: ShardFileTransportOptions): transports.FileTransportOptions => ({
  dirname: "logs",
  filename: fileName,
  format: format.combine(baseFormat, messageFormat),
  maxFiles: 1,
  maxsize: maxSize,
});

export const logger = createLogger({
  level: "silly",
  levels,
  transports: [
    new transports.Console({
      format: format.combine(
        baseFormat,
        format.align(),
        format.colorize({
          level: true,
        }),
        messageFormat,
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
    // TODO: Send error logs to Discord webhook.
    /*new transports.Stream({
      format: format.printf(({ message }) => String(message)),
      level: "error",
      stream: new Stream.Writable({
        write: async (chunk, _encoding, callback) => {
          const logMessage = Buffer.from(chunk).toString();

          await RestManager.executeWebhook(WEBHOOK_LOGGER_ID, WEBHOOK_LOGGER_TOKEN, {
            embeds: createEmbeds().setDescription(codeBlock("ts", logMessage)),
          });

          callback();
        },
      }),
    }),*/
  ],
});

interface ShardFileTransportOptions {
  fileName: string;
  maxSize: number;
}
