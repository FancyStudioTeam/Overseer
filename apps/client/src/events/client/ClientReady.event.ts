import { ClientEvents, defineEventConfig, type EventHandler } from 'linkcord';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.ClientReady,
	once: true,
});

export const handler: EventHandler<typeof config> = ({ user: { globalName, username } }) =>
	logger.info(`Client '${globalName ?? username}' is ready`);
