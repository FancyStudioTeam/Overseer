import { ClientEvents, defineEventConfig, type EventHandler } from 'linkcord';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.GatewayShardDisconnect,
});

export const handler: EventHandler<typeof config> = ({ code, gatewayShard: { id }, isReconnectable, reason }) =>
	logger.warn(
		`Shard ${id} has been disconnected with close code ${code} (Reason: ${reason || 'N/A'}) [${isReconnectable ? 'Can be reconnectable' : 'Cannot be reconnectable'}]`,
	);
