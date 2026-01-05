import { ClientEvents } from 'linkcord';
import { defineEventConfig, type EventHandler } from 'linkcord/handlers';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.GatewayShardReady,
});

export const handler: EventHandler<typeof config> = ({ gatewayShard: { id } }) =>
	logger.info(`Shard ${id} has successfully completed his handshake with the Discord gateway`);
