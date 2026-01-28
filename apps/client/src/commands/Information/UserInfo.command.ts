import type { User } from 'linkcord';
import { ContainerBuilder, SeparatorBuilder, TextDisplayBuilder } from 'linkcord/builders';
import {
	type ChatInputCommandContext,
	ChatInputCommandHandler,
	createUserOption,
	Declare,
	Options as DeclareOptions,
} from 'linkcord/handlers';
import { MessageFlags } from 'linkcord/types';
import { bold, HeadingLevel, header } from 'linkcord/utils';
import { formatTextDisplayContent } from '#utils/formatTextDisplayContent.js';

const Options = {
	user: createUserOption({
		description: 'The user to display its information',
	}),
};

@Declare({
	description: 'Displays the information of the user',
	name: 'user-info',
})
@DeclareOptions(Options)
export default class extends ChatInputCommandHandler {
	async run({ interaction, options }: ChatInputCommandContext<typeof Options>) {
		const { user: userInteraction } = interaction;
		const { user: userOption } = options;

		const user = userOption ?? userInteraction;
		const mainContainerBuilder = this.createMainContainerBuilder(user);

		await interaction.createMessage({
			components: [
				mainContainerBuilder,
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}

	private buildDateOfCreationBuilder({ createdAt }: User): TextDisplayBuilder {
		const formattedCreatedAt = this.formatDateString(createdAt);

		const textDisplayBuilder = new TextDisplayBuilder();
		const textDisplayBuilderContent = [
			bold('Date of Creation'),
			formatTextDisplayContent(formattedCreatedAt),
		];

		textDisplayBuilder.setContent(textDisplayBuilderContent.join('\n'));

		return textDisplayBuilder;
	}

	private buildGeneralInformationBuilder({ id, username }: User): TextDisplayBuilder {
		const textDisplayBuilder = new TextDisplayBuilder();
		const textDisplayBuilderContent = [
			bold('General Information'),
			formatTextDisplayContent([
				`User Name » ${username}`,
				`User ID » ${id}`,
			]),
		];

		textDisplayBuilder.setContent(textDisplayBuilderContent.join('\n'));

		return textDisplayBuilder;
	}

	private createMainContainerBuilder(user: User): ContainerBuilder {
		const { username } = user;

		const titleBuilder = new TextDisplayBuilder().setContent(
			header(HeadingLevel.Three, `Information of ${username}`),
		);

		const separatorBuilder = new SeparatorBuilder();
		const containerBuilder = new ContainerBuilder();

		const [generalInformationBuilder, dateOfCreationBuilder] = [
			this.buildGeneralInformationBuilder(user),
			this.buildDateOfCreationBuilder(user),
		];

		containerBuilder.addComponents([
			titleBuilder,
			separatorBuilder,
			generalInformationBuilder,
			dateOfCreationBuilder,
		]);

		return containerBuilder;
	}

	private formatDateString(date: Date): string {
		return date.toLocaleString('en-US', {
			day: 'numeric',
			month: 'long',
			weekday: 'long',
			year: 'numeric',
		});
	}
}
