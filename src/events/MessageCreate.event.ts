import {
	ClientEvents,
	ComponentType,
	defineEventConfig,
	type EventHandler,
	FormatterUtils,
	MessageFlags,
} from "linkcord";
import { client } from "../index.js";

export const config = defineEventConfig({
	name: ClientEvents.MessageCreate,
});

export const handler: EventHandler<ClientEvents.MessageCreate> = async ({ message, gatewayShard }) => {
	if (message.content === ">ping") {
		const { latency } = gatewayShard;
		const { channelId } = message;

		const createdMessage = await client.rest.channels.createMessage(channelId, {
			components: [
				{
					components: [
						{
							content: FormatterUtils.bold(`WebSocket Latency: ${latency}ms`),
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

		createdMessage.content;
	}
};
