import type { GatewayManager, GatewayShard } from 'linkcord';
import { ContainerBuilder, TextDisplayBuilder } from 'linkcord/builders';
import {
	type ChatInputCommandContext,
	ChatInputCommandHandler,
	Declare,
} from 'linkcord/handlers';
import { MessageFlags } from 'linkcord/types';
import type { Collection } from 'linkcord/utils';
import { formatTextDisplayContent } from '#utils/formatTextDisplayContent.js';

@Declare({
	description: 'Displays the latency of all Vanguard gateway shards',
	name: 'ping',
})
export default class extends ChatInputCommandHandler {
	async run({ client, interaction }: ChatInputCommandContext) {
		const { gateway } = client;
		const mainContainerBuilder = this.createMainContainerBuilder(gateway);

		await interaction.createMessage({
			components: [
				mainContainerBuilder,
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}

	private createGatewayShardsBuilder({
		shards,
	}: GatewayManager): TextDisplayBuilder {
		const gatewayShardsListPairs =
			this.formatGatewayShardsListPairs(shards);

		const textDisplayBuilder = new TextDisplayBuilder();
		const textDisplayBuilderContent = [
			formatTextDisplayContent(gatewayShardsListPairs),
		];

		textDisplayBuilder.setContent(textDisplayBuilderContent.join('\n'));

		return textDisplayBuilder;
	}

	private createMainContainerBuilder(
		gatewayManager: GatewayManager,
	): ContainerBuilder {
		const containerBuilder = new ContainerBuilder();
		const gatewayShardsBuilder =
			this.createGatewayShardsBuilder(gatewayManager);

		containerBuilder.addComponents([
			gatewayShardsBuilder,
		]);

		return containerBuilder;
	}

	private formatGatewayShardsListPairs(
		shards: Collection<number, GatewayShard>,
	): string[] {
		const shardsArray = shards.toArray();
		const shardsArrayPairs = shardsArray.map(
			({ id, latency }) => `Gateway Shard #${id} » ${latency}ms`,
		);

		return shardsArrayPairs;
	}
}
