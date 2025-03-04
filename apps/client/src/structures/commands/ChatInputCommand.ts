import {
  ApplicationCommandTypes,
  type CreateSlashApplicationCommand,
  type DiscordApplicationCommandOption,
} from "@discordeno/bot";

export abstract class ChatInputCommand {
  /** Whether to load all the chat input sub commands automatically. */
  _autoLoad = false;
  _declareDecoratorData: Partial<ChatInputCommandOptions> = {};
  /** The loaded chat input sub commands from the current directory. */
  _subCommandOptions: DiscordApplicationCommandOption[] = [];

  /**
   * Gets the JSON representation of the command instance.
   * @returns A compatible object with the Discord API.
   */
  toJSON(): CreateSlashApplicationCommand {
    const { description, descriptionLocalizations, name } = this._declareDecoratorData;
    const options = this._subCommandOptions;

    return {
      description: description ?? "",
      descriptionLocalizations,
      name: name ?? "",
      options,
      type: ApplicationCommandTypes.ChatInput,
    };
  }
}

export type ChatInputCommandOptions = Pick<
  CreateSlashApplicationCommand,
  "description" | "descriptionLocalizations" | "name"
>;
