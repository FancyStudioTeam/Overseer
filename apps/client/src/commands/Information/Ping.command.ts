import { ContainerBuilder, TextDisplayBuilder } from 'linkcord/builders';
import { type ChatInputCommandContext, ChatInputCommandHandler, Declare } from 'linkcord/handlers';
import { MessageFlags } from 'linkcord/types';
import { bold } from 'linkcord/utils';
import { LAN_EMOJI } from '#utils/Emojis.js';

@Declare({
	description: 'Displays the latency of the bot',
	name: 'ping',
})
export default class extends ChatInputCommandHandler {
	async run({ client, interaction }: ChatInputCommandContext) {
		const { gateway } = client;
		const { averageLatency } = gateway;

		const containerBuilder = this.createContainerComponent(averageLatency);

		await interaction.createMessage({
			components: [
				containerBuilder,
			],
			flags: [
				MessageFlags.IsComponentsV2,
			],
		});
	}

	private createContainerComponent(averageLatency: number): ContainerBuilder {
		const webSocketLatencyComponent = new TextDisplayBuilder().setContent(
			bold(`${LAN_EMOJI} Average WebSocket Ping: ${averageLatency}`),
		);

		const containerBuilder = new ContainerBuilder();

		containerBuilder.addComponent(webSocketLatencyComponent);

		return containerBuilder;
	}
}
