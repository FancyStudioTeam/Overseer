import { ClientEvents, defineEventConfig, type EventHandler } from 'linkcord';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.RestRequest,
});

export const handler: EventHandler<typeof config> = ({ request: { method }, response: { statusCode, statusText }, url }) =>
	logger.http(`[${method}] "${url}" - Status: ${statusCode} [${statusText}]`);
