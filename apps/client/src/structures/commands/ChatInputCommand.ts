import {
  ApplicationCommandTypes,
  type CreateSlashApplicationCommand,
  type DiscordApplicationCommandOption,
} from "@discordeno/bot";
import { CreateCommandTypes } from "@util/types.js";

export abstract class ChatInputCommand {
  /** Whether to load all the chat input sub commands automatically. */
  _autoLoad = false;
  _registerOptions: Partial<ChatInputCommandOptions> = {};
  /** The loaded chat input sub commands from the current directory. */
  _subCommandOptions: DiscordApplicationCommandOption[] = [];
  type: CreateCommandTypes.ChatInput = CreateCommandTypes.ChatInput;

  toJSON(): CreateSlashApplicationCommand {
    const { description, descriptionLocalizations, name } = this._registerOptions;
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
