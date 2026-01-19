import { ClientEvents } from 'linkcord';
import { defineEventConfig, type EventHandler } from 'linkcord/handlers';
import { logger } from '#utils/Logger.js';

export const config = defineEventConfig({
	event: ClientEvents.GatewayShardDisconnect,
});

export const handler: EventHandler<typeof config> = ({
	code,
	gatewayShard,
	isReconnectable,
	reason,
}) => {
	const { id } = gatewayShard;
	const messageBase = `Shard ${id} has been disconnected with close code ${code} (Reason: ${reason || 'N/A'})`;

	if (isReconnectable) {
		logger.warn(`${messageBase}. This shard can be reconnected.`);
	} else {
		logger.error(
			`${messageBase}. This shard cannot be reconnected and must start a new session.`,
		);
	}
};
