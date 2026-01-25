import type { GatewayManager, GatewayShard } from 'linkcord';
import { ContainerBuilder, TextDisplayBuilder } from 'linkcord/builders';
import { type ChatInputCommandContext, ChatInputCommandHandler, Declare } from 'linkcord/handlers';
import { MessageFlags } from 'linkcord/types';
import { bold, CodeBlockLanguage, type Collection, codeBlock } from 'linkcord/utils';
import { formatKeyValues } from '#utils/formatKeyValues.js';

@Declare({
	description: 'Displays the latency of the bot',
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

	private buildGatewayShardsBuilder({ shards }: GatewayManager): TextDisplayBuilder {
		const formattedShardsPairs = this.formatGatewayShards(shards);

		const textDisplayBuilder = new TextDisplayBuilder();
		const textDisplayBuilderContent = [
			bold('Gateway Shards'),
			codeBlock(CodeBlockLanguage.ANSI, formatKeyValues(formattedShardsPairs)),
		];

		textDisplayBuilder.setContent(textDisplayBuilderContent.join('\n'));

		return textDisplayBuilder;
	}

	private createMainContainerBuilder(gatewayManager: GatewayManager): ContainerBuilder {
		const containerBuilder = new ContainerBuilder();
		const gatewayShardsBuilder = this.buildGatewayShardsBuilder(gatewayManager);

		containerBuilder.addComponents([
			gatewayShardsBuilder,
		]);

		return containerBuilder;
	}

	private formatGatewayShards(shards: Collection<number, GatewayShard>): [
		Key: string,
		Value: string,
	][] {
		const shardsArray = shards.toArray();
		const shardsArrayPairs = shardsArray.map<
			[
				Key: string,
				Value: string,
			]
		>(({ id, latency }) => [
			`Gateway Shard #${id}`,
			`${latency}ms`,
		]);

		return shardsArrayPairs;
	}
}
