import { ContainerBuilder, TextDisplayBuilder } from 'linkcord/builders';
import { ChatInputCommandHandler, type ChatInputCommandHandlerRunOptions, Declare } from 'linkcord/handlers';
import { MessageFlags } from 'linkcord/types';
import { bold, inlineCode } from 'linkcord/utils';
import { LAN_EMOJI } from '#utils/Emojis.js';

@Declare({
	description: 'Displays the information',
	name: 'ping',
})
export default class extends ChatInputCommandHandler {
	async run({ client, interaction }: ChatInputCommandHandlerRunOptions) {
		const { gateway } = client;
		const { averageLatency } = gateway;

		await interaction.createMessage({
			components: [
				new ContainerBuilder().addComponents([
					new TextDisplayBuilder().setContent(bold(`${LAN_EMOJI} Average WebSocket Ping: ${inlineCode(`${averageLatency}ms`)}`)),
				]),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
