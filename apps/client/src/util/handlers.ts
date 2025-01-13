import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  type CreateContextApplicationCommand,
  type CreateSlashApplicationCommand,
  type DiscordApplicationCommandOption,
  DiscordApplicationIntegrationType,
  DiscordInteractionContextType,
} from "@discordeno/bot";
import type { Client } from "@index";
import { CreateCommandTypes, type Interaction, type User } from "@types";
import type { Namespace, TFunction } from "i18next";

export abstract class ChatInputCommand {
  _autoLoad = false;
  _data: Partial<CreateSlashApplicationCommand> = {};
  _options: DiscordApplicationCommandOption[] = [];
  type: CreateCommandTypes.ChatInput = CreateCommandTypes.ChatInput;

  constructor(options: ChatInputCommandOptions) {
    this._data = {
      description: options.description,
      name: options.name,
    };
  }

  // biome-ignore lint/style/useNamingConvention:
  toJSON(): CreateSlashApplicationCommand {
    return {
      contexts: [DiscordInteractionContextType.Guild],
      description: this._data.description ?? "",
      descriptionLocalizations: this._data.descriptionLocalizations ?? {},
      integrationTypes: [DiscordApplicationIntegrationType.GuildInstall],
      name: this._data.name ?? "",
      options: this._options,
      type: ApplicationCommandTypes.ChatInput,
    };
  }
}

export abstract class ChatInputSubCommand {
  _data: Partial<DiscordApplicationCommandOption> = {};

  constructor(options: ChatInputSubCommandOptions) {
    this._data = {
      description: options.description,
      name: options.name,
      type: options.type,
    };
  }

  abstract run(options: ChatInputSubCommandRunOptions): Promise<void>;

  // biome-ignore lint/style/useNamingConvention:
  toJSON(): DiscordApplicationCommandOption {
    return {
      description: this._data.description ?? "",
      name: this._data.name ?? "",
      type: this._data.type ?? ApplicationCommandOptionTypes.SubCommand,
    };
  }
}

export abstract class UserContextCommand {
  _data: Partial<CreateContextApplicationCommand> = {};
  type: CreateCommandTypes.User = CreateCommandTypes.User;

  constructor(options: UserContextCommandOptions) {
    this._data = {
      name: options.name,
    };
  }

  abstract run(options: UserContextCommandRunOptions): Promise<void>;

  // biome-ignore lint/style/useNamingConvention:
  toJSON(): CreateContextApplicationCommand {
    return {
      contexts: [DiscordInteractionContextType.Guild],
      integrationTypes: [DiscordApplicationIntegrationType.GuildInstall],
      name: this._data.name ?? "",
      type: ApplicationCommandTypes.User,
    };
  }
}

interface ChatInputCommandOptions
  extends Pick<CreateSlashApplicationCommand, "description" | "descriptionLocalizations" | "name"> {}

interface ChatInputSubCommandOptions extends Pick<DiscordApplicationCommandOption, "description" | "name" | "type"> {}

interface UserContextCommandOptions extends Pick<CreateContextApplicationCommand, "name"> {}

export interface CommandRunOptions {
  client: Client;
  context: Interaction;
  t: TFunction<Namespace, undefined>;
}

export interface ChatInputSubCommandRunOptions extends CommandRunOptions {}

export interface UserContextCommandRunOptions extends CommandRunOptions {
  targetUser: User;
}
