import { ClientEvents, ComponentType, defineEventConfig, type EventHandler, MessageFlags } from 'linkcord';
import { bold } from 'linkcord/utils';
import { client } from '../index.js';

export const config = defineEventConfig({
	name: ClientEvents.MessageCreate,
});

export const handler: EventHandler<ClientEvents.MessageCreate> = async ({ message }) => {
	const { rest } = client;
	const {
		api: { channels },
	} = rest;
	const { channelId, content } = message;

	if (content === '>ping') {
		const { gateway } = client;
		const { averageLatency } = gateway;

		await channels.createMessage(channelId, {
			components: [
				{
					components: [
						{
							content: [
								bold(`Average Gateway Ping: ${averageLatency}`),
							].join('\n'),
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
