import { Writable } from "node:stream";
import { codeBlock } from "@discordjs/formatters";
import { createWebhookMessage } from "@functions/createWebhookMessage.js";
import { addColors, createLogger, format, transports } from "winston";

const { align, colorize, combine, printf, timestamp } = format;
const { Console, File, FileTransportOptions, Stream } = transports;
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
  /**
   * The "levels" object is used to define the logger levels.
   * They are ordered from the most severe to the least severe.
   * Documentation: https://github.com/winstonjs/winston?tab=readme-ov-file#logging
   */
  levels: {
    debug: 5,
    error: 0,
    http: 3,
    info: 2,
    silly: 6,
    verbose: 4,
    warn: 1,
    gateway: 7,
  },
};
const { colors, levels } = loggerLevelsConfig;

/** Add the specified colors to the logger. */
addColors(colors);

/** Create the base format for the logger. */
const baseFormat = combine(
  timestamp({
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
/** Create the message format for the logger. */
const messageFormat = printf(({ level, message, timestamp }) => `[${timestamp}] ${level} ${message}`);
const sharedFileTransport = ({ fileName, level, maxSize }: ShardFileTransportOptions): typeof FileTransportOptions => ({
  dirname: "logs",
  filename: fileName,
  format: combine(baseFormat, messageFormat),
  level,
  maxFiles: 1,
  maxsize: maxSize,
});

export const logger = createLogger({
  /** Set the logger level to the least severe. */
  level: "gateway",
  levels,
  transports: [
    new Console({
      format: combine(
        baseFormat,
        align(),
        colorize({
          level: true,
        }),
        messageFormat,
      ),
    }),
    new File(
      sharedFileTransport({
        fileName: "errors.log",
        level: "error",
        maxSize: 75_000_200,
      }),
    ),
    new File(
      sharedFileTransport({
        fileName: "all.log",
        maxSize: 250_000_000,
      }),
    ),
    new Stream({
      format: printf(({ message }) => String(message)),
      level: "error",
      stream: new Writable({
        write: async (chunk, _encoding, callback) => {
          /** Convert the chunk to a string. */
          const logMessage = Buffer.from(chunk).toString();

          /** Create a webhook message in the private errors channel. */
          await createWebhookMessage(codeBlock("ts", logMessage));

          callback();
        },
      }),
    }),
  ],
});

interface ShardFileTransportOptions {
  /** The file name. */
  fileName: string;
  /** The log level. */
  level?: string;
  /** The maximum file size. */
  maxSize: number;
}

declare module "winston" {
  interface Logger {
    // biome-ignore lint/correctness/noUndeclaredVariables: Module Augmentation does not require explicit declaration.
    gateway: LeveledLogMethod;
  }
}
