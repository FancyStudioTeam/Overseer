import { ClientEvents } from 'linkcord';
import { defineEventConfig, type EventHandler } from 'linkcord/handlers';
import { logger } from '#lib/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.RestRequest,
});

export const handler: EventHandler<typeof config> = ({ request, response, url }) => {
	const { method } = request;
	const { statusCode, statusText } = response;

	logger.http(`[${method}] "${url}" - Status: ${statusCode} [${statusText}]`);
};
