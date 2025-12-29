import { ClientEvents, defineEventConfig, type EventHandler } from 'linkcord';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.GatewayShardReady,
});

export const handler: EventHandler<typeof config> = ({ gatewayShard: { id } }) =>
	logger.info(`Shard ${id} has successfully completed his handshake with the Discord gateway`);
