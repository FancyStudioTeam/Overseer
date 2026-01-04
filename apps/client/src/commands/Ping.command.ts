import {
	ChatInputCommandHandler,
	type ChatInputCommandHandlerRunOptions,
	ComponentType,
	Declare,
	InteractionCallbackType,
	MessageFlags,
} from 'linkcord';
import { bold } from 'linkcord/utils';

@Declare({
	description: 'Displays the information',
	name: 'ping',
})
export default class extends ChatInputCommandHandler {
	async run({ client, interaction }: ChatInputCommandHandlerRunOptions): Promise<void> {
		const { id, token } = interaction;
		const { gateway } = client;
		const { averageLatency } = gateway;

		await client.rest.resources.interactions.createInteractionResponse(id, token, {
			data: {
				components: [
					{
						components: [
							{
								content: bold(`🏓 Pong! ${averageLatency}ms`),
								type: ComponentType.TextDisplay,
							},
						],
						type: ComponentType.Container,
					},
				],
				flags: MessageFlags.IsComponentsV2,
			},
			type: InteractionCallbackType.ChannelMessageWithSource,
		});
	}
}
