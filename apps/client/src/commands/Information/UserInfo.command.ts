import type { User } from 'linkcord';
import { ContainerBuilder, SeparatorBuilder, TextDisplayBuilder } from 'linkcord/builders';
import { type ChatInputCommandContext, ChatInputCommandHandler, Declare } from 'linkcord/handlers';
import { MessageFlags } from 'linkcord/types';
import { bold, HeadingLevel, header, inlineCode, unixTimestamp } from 'linkcord/utils';
import { CALENDAR_TODAY_EMOJI, ID_CARD_EMOJI, INFO_EMOJI } from '#lib/Emojis.js';

/*const Options = {
	user: createUserOption({
		description: 'The user to display its information',
	}),
};*/

@Declare({
	description: 'Displays the information of the user',
	name: 'user-info',
})
// @DeclareOptions(Options)
export default class extends ChatInputCommandHandler {
	async run(context: ChatInputCommandContext) {
		const { interaction } = context;

		const user = interaction.user;
		const mainContainerBuilder = this.createMainContainerBuilder(user);

		await interaction.createMessage({
			components: [
				mainContainerBuilder,
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}

	private createMainContainerBuilder(user: User): ContainerBuilder {
		const { createdAt, id, username } = user;

		const titleBuilder = new TextDisplayBuilder().setContent(
			header(HeadingLevel.Three, `${INFO_EMOJI} Information of ${inlineCode(username)}`),
		);
		const generalInformationBuilder = new TextDisplayBuilder().setContent(
			[
				bold('General Information'),
				[
					`${bold(`${ID_CARD_EMOJI} User ID`)}: ${inlineCode(id)}`,
					`${bold(`${CALENDAR_TODAY_EMOJI} Created At`)}: ${unixTimestamp(createdAt)}`,
				].join('\n'),
			].join('\n'),
		);

		const separatorBuilder = new SeparatorBuilder();
		const containerBuilder = new ContainerBuilder();

		containerBuilder.addComponents([
			titleBuilder,
			separatorBuilder,
			generalInformationBuilder,
		]);

		return containerBuilder;
	}
}
