import { ClientEvents, defineEventConfig, type EventHandler } from 'linkcord';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.GatewayShardDisconnect,
});

export const handler: EventHandler<typeof config> = ({ code, gatewayShard: { id }, isReconnectable, reason }) => {
	const messageBase = `Shard ${id} has been disconnected with close code ${code} (Reason: ${reason || 'N/A'})`;

	if (isReconnectable) {
		logger.warn(`${messageBase}. This disconnection can be reconnected.`);
	} else {
		logger.error(`${messageBase}. This disconnection cannot be reconnected and must start a new session.`);
	}
};
