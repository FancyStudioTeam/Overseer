import { addColors, createLogger, format, transports } from 'winston';

const { align, colorize, combine, printf, timestamp } = format;
const { Console } = transports;

const LOGGER_BASE_FORMAT = combine(
	timestamp({
		/*
		 * NOTE: Timestamp should be in Spanish date format. Please do not modify
		 * this value.
		 */
		format: 'DD/MM/YYYY HH:mm:ss',
	}),
	format((info) => {
		const { level, message } = info;

		const formattedLevel = level.toUpperCase();
		const formattedMessage = typeof message === 'object' ? JSON.stringify(message, null, 4) : message;

		info.level = formattedLevel;
		info.message = formattedMessage;

		return info;
	})(),
);
const LOGGER_MESSAGE_FORMAT = printf(({ level, message, timestamp }) => `[${timestamp}] ${level} ${message}`);

const LOGGER_LEVEL_COLORS: Record<LoggerLevels, string> = {
	debug: 'magenta',
	error: 'red',
	info: 'cyan',
	warn: 'yellow',
};

/*
 * Winston levels are sorted from most (0) to least severe.
 * Reference: https://github.com/winstonjs/winston?tab=readme-ov-file#logging
 */
const LOGGER_LEVELS = {
	debug: 3,
	error: 0,
	info: 2,
	warn: 1,
};

addColors(LOGGER_LEVEL_COLORS);

const CONSOLE_TRANSPORT = new Console({
	format: combine(
		LOGGER_BASE_FORMAT,
		align(),
		colorize({
			level: true,
		}),
		LOGGER_MESSAGE_FORMAT,
	),
});

export const logger = createLogger({
	level: 'debug',
	levels: LOGGER_LEVELS,
	transports: [
		CONSOLE_TRANSPORT,
	],
});

type LoggerLevels = keyof typeof LOGGER_LEVELS;
