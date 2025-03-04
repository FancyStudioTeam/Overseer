import {
  type ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  type DiscordApplicationCommandOption,
} from "@discordeno/bot";

export abstract class ChatInputSubCommandGroup {
  /** Whether to load all the chat input sub commands automatically. */
  _autoLoad = false;
  _declareDecoratorData: Partial<ChatInputSubCommandGroupOptions> = {};
  /** The loaded chat input sub commands from the current directory. */
  _subCommandOptions: DiscordApplicationCommandOption[] = [];

  /**
   * Gets the JSON representation of the command instance.
   * @returns A compatible object with the Discord API.
   */
  toJSON(): ApplicationCommandOption {
    const { description, descriptionLocalizations, name } = this._declareDecoratorData;
    const options = this._subCommandOptions;

    return {
      description: description ?? "",
      descriptionLocalizations,
      name: name ?? "",
      options,
      type: ApplicationCommandOptionTypes.SubCommandGroup,
    };
  }
}

export type ChatInputSubCommandGroupOptions = Pick<
  ApplicationCommandOption,
  "description" | "descriptionLocalizations" | "name" | "options"
>;
