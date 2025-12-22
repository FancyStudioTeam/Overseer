import { ClientEvents, ComponentType, defineEventConfig, type EventHandler, MessageFlags } from "linkcord";
import { FormatterUtils, LINKCORD_VERSION } from "linkcord/utils";
import { client } from "../index.js";

export const config = defineEventConfig({
	name: ClientEvents.MessageCreate,
});

export const handler: EventHandler<ClientEvents.MessageCreate> = async ({ message, gatewayShard }) => {
	if (message.content === ">ping") {
		const { latency } = gatewayShard;
		const { channelId } = message;

		await client.rest.channels.createMessage(channelId, {
			components: [
				{
					components: [
						{
							content: `${FormatterUtils.bold(`WebSocket Latency: ${latency}ms`)}\n${FormatterUtils.subtext(`Version: ${LINKCORD_VERSION}`)}`,
							type: ComponentType.TextDisplay,
						},
					],
					type: ComponentType.Container,
				},
			],
			flags: [
				MessageFlags.IsComponentsV2,
			],
		});
	}
};
