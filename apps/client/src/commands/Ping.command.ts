import { TextDisplay } from 'linkcord/builders';
import { ChatInputCommandHandler, type ChatInputCommandHandlerRunOptions, Declare } from 'linkcord/handlers';
import { ComponentType, InteractionCallbackType, MessageFlags } from 'linkcord/types';
import { bold } from 'linkcord/utils';

@Declare({
	description: 'Displays the information',
	name: 'ping',
})
export default class extends ChatInputCommandHandler {
	async run({ client, interaction }: ChatInputCommandHandlerRunOptions) {
		const { gateway } = client;
		const { averageLatency } = gateway;

		await interaction.createInteractionResponse({
			data: {
				components: [
					{
						components: [
							new TextDisplay().setContent(bold(`🏓 Pong! ${averageLatency}ms`)).toJSON(),
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
