import { ClientEvents, defineEventConfig, type EventHandler } from 'linkcord';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.Debug,
});

export const handler: EventHandler<typeof config> = ({ message }) => logger.debug(message);
