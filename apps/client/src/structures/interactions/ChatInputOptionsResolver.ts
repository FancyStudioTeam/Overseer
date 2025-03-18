import { ApplicationCommandOptionTypes, type InteractionDataOption } from "@discordeno/bot";
import type { Interaction } from "@util/types.js";

export class ChatInputOptionsResolver {
  private readonly options: InteractionDataOption[];

  constructor(interaction: Interaction) {
    const { data } = interaction;
    const { options: interactionOptions } = data ?? {};

    this.options = interactionOptions ?? [];
  }

  /**
   * Gets all the options from the interaction.
   * @returns An array containing all the options.
   */
  private getOptions(): InteractionDataOption[] {
    const { options } = this;

    return options;
  }

  /**
   * Gets the sub command names from chat input application commands.
   * @returns An array containing the sub command names.
   */
  getSubCommandNames(): string[] {
    const options = this.getOptions();
    const subCommands = this.getSubCommandsFromOptions(options);

    return subCommands.map(({ name }) => name);
  }

  /**
   * Gets the sub command objects from the options.
   * @param options - The options to filter.
   * @returns An array containing the sub command objects.
   */
  private getSubCommandsFromOptions(options: InteractionDataOption[]): InteractionDataOption[] {
    const subCommandGroups = options.filter(({ type }) => type === ApplicationCommandOptionTypes.SubCommandGroup);

    if (subCommandGroups.length > 0) {
      const subCommandGroup = subCommandGroups[0];
      const { options: subCommandGroupOptions } = subCommandGroup;

      return [subCommandGroup, ...this.getSubCommandsFromOptions(subCommandGroupOptions ?? [])];
    }

    const subCommands = options.filter(({ type }) => type === ApplicationCommandOptionTypes.SubCommand);

    return subCommands;
  }
}
