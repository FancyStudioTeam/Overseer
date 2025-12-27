import { ClientEvents, defineEventConfig, type EventHandler } from 'linkcord';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	name: ClientEvents.Debug,
});

export const handler: EventHandler<ClientEvents.Debug> = ({ message }) => logger.debug(message);
