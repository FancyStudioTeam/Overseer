import {
  ApplicationCommandTypes,
  type CreateSlashApplicationCommand,
  type DiscordApplicationCommandOption,
} from "@discordeno/bot";
import { CreateCommandTypes } from "@util/types.js";

export abstract class ChatInputCommand {
  /** Whether to load all the chat input sub commands automatically. */
  _autoLoad = false;
  _data: Partial<ChatInputCommandOptions> = {};
  /** The loaded chat input sub commands. */
  _options: DiscordApplicationCommandOption[] = [];
  type: CreateCommandTypes.ChatInput = CreateCommandTypes.ChatInput;

  toJSON(): CreateSlashApplicationCommand {
    const { description, descriptionLocalizations, name } = this._data;
    const options = this._options;

    return {
      description: description ?? "",
      descriptionLocalizations,
      name: name ?? "",
      options,
      type: ApplicationCommandTypes.ChatInput,
    };
  }
}

type ChatInputCommandOptions = Pick<CreateSlashApplicationCommand, "description" | "descriptionLocalizations" | "name">;
