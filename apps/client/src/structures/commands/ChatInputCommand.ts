import {
  ApplicationCommandTypes,
  type CreateSlashApplicationCommand,
  type DiscordApplicationCommandOption,
} from "@discordeno/bot";
import { CreateCommandTypes } from "@types";

/**
 * Exports the "ChatInputCommand" class to create a new chat input command instance.
 */
export abstract class ChatInputCommand {
  /**
   * Loads all the sub command options automatically.
   */
  _autoLoad = false;
  _data: ChatInputCommandOptions;
  /**
   * All the sub command options that were loaded using "_autoLoad" property or manually.
   */
  _options: DiscordApplicationCommandOption[] = [];
  type: CreateCommandTypes.ChatInput = CreateCommandTypes.ChatInput;

  constructor(options: ChatInputCommandOptions) {
    const { description, descriptionLocalizations, name } = options;

    this._data = {
      description,
      descriptionLocalizations,
      name,
    };
  }

  // biome-ignore lint/style/useNamingConvention: JSON should be capitalized.
  toJSON(): CreateSlashApplicationCommand {
    const { description, descriptionLocalizations, name } = this._data;
    const options = this._options;

    return {
      description,
      descriptionLocalizations,
      name,
      options,
      type: ApplicationCommandTypes.ChatInput,
    };
  }
}

type ChatInputCommandOptions = Pick<CreateSlashApplicationCommand, "description" | "descriptionLocalizations" | "name">;
