import 'server-only';

import { addColors, createLogger, format, transports } from 'winston';
import { getMemoryUsage } from '#/utils/getMemoryUsage.ts';

const { align, colorize, combine, printf, timestamp } = format;
const { Console } = transports;

const LOGGER_BASE_FORMAT = combine(
	timestamp({
		format: 'YYYY/MM/DD HH:mm:ss',
	}),
	format((info) => {
		const { level, message } = info;

		const getMessage = () => {
			if (typeof message === 'object') {
				return JSON.stringify(message, null, 4);
			}

			return message;
		};

		const formattedLevel = level.toUpperCase();
		const formattedMessage = getMessage();

		info.level = formattedLevel;
		info.memoryUsage = getMemoryUsage();
		info.message = formattedMessage;

		return info;
	})(),
);
const LOGGER_MESSAGE_FORMAT = printf(
	({ level, memoryUsage, message, timestamp }) =>
		`[Memory Usage: ${memoryUsage}] [${timestamp}] ${level} ${message}`,
);

const LOGGER_LEVEL_COLORS: Record<LoggerLevels, string> = {
	debug: 'magenta',
	error: 'red',
	http: 'blue',
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
	http: 4,
	info: 2,
	warn: 1,
};

addColors(LOGGER_LEVEL_COLORS);

const CONSOLE_TRANSPORT = new Console({
	format: combine(
		LOGGER_BASE_FORMAT,
		align(),
		colorize({
			all: true,
		}),
		LOGGER_MESSAGE_FORMAT,
	),
});

export const logger = createLogger({
	level: 'http',
	levels: LOGGER_LEVELS,
	transports: [
		CONSOLE_TRANSPORT,
	],
});

type LoggerLevels = keyof typeof LOGGER_LEVELS;
