import { ClientEvents, defineEventConfig, type EventHandler } from 'linkcord';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	name: ClientEvents.ClientReady,
	once: true,
});

export const handler: EventHandler<ClientEvents.ClientReady> = ({ user: { globalName, username } }) =>
	logger.info(`Client '${globalName ?? username}' is ready`);
