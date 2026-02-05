import { ClientEvents } from 'linkcord';
import { defineEventConfig, type EventHandler } from 'linkcord/handlers';
import { logger } from '#lib/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.GatewayShardReady,
});

export const handler: EventHandler<typeof config> = ({ gatewayShard }) => {
	const { id } = gatewayShard;

	logger.info(
		`Shard ${id} has successfully completed his handshake with the Discord gateway`,
	);
};
