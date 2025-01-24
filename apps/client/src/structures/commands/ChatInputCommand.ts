import {
  ApplicationCommandTypes,
  type CreateSlashApplicationCommand,
  type DiscordApplicationCommandOption,
} from "@discordeno/bot";
import { CreateCommandTypes } from "@types";

export abstract class ChatInputCommand {
  /** Whether to load all the chat input sub commands automatically. */
  _autoLoad = false;
  _data: ChatInputCommandOptions;
  /** The loaded chat input sub commands list. */
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
