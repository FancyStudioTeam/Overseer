import {
  type ApplicationCommandOption,
  ApplicationCommandTypes,
  type CreateApplicationCommand,
  type CreateContextApplicationCommand,
  type CreateSlashApplicationCommand,
  type DiscordApplicationCommandOption,
  DiscordApplicationIntegrationType,
  DiscordInteractionContextType,
} from "@discordeno/bot";
import type { Client } from "@index";
import { CreateCommandTypes, type Interaction, type User } from "@types";
import type { Namespace, TFunction } from "i18next";

/**
 * All the main properties that every application command should have when they are registered.
 * Application commands should not be registered outside of guilds.
 */
const mainRegistrationProperties: Pick<CreateApplicationCommand, "contexts" | "integrationTypes" | "nsfw"> = {
  contexts: [DiscordInteractionContextType.Guild],
  integrationTypes: [DiscordApplicationIntegrationType.GuildInstall],
  nsfw: false,
};

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

  // biome-ignore lint/style/useNamingConvention: JSON should be upper case.
  toJSON(): CreateSlashApplicationCommand {
    const { description, descriptionLocalizations, name } = this._data;
    const options = this._options;

    return {
      ...mainRegistrationProperties,
      description,
      descriptionLocalizations,
      name,
      options,
      type: ApplicationCommandTypes.ChatInput,
    };
  }
}

/**
 * Exports the "ChatInputSubCommand" class to create a new chat input sub command option instance.
 */
export abstract class ChatInputSubCommand {
  _data: ChatInputSubCommandOptions;

  constructor(options: ChatInputSubCommandOptions) {
    const { description, descriptionLocalizations, name, type } = options;

    this._data = {
      description,
      descriptionLocalizations,
      name,
      type,
    };
  }

  abstract run(options: ChatInputSubCommandRunOptions): Promise<void>;

  // biome-ignore lint/style/useNamingConvention: JSON should be upper case.
  toJSON(): ApplicationCommandOption {
    const { description, descriptionLocalizations, name, type } = this._data;

    return {
      description,
      descriptionLocalizations,
      name,
      type,
    };
  }
}

/**
 * Exports the "UserContextCommand" class to create a new user context command instance.
 */
export abstract class UserContextCommand {
  _data: UserContextCommandOptions;
  type: CreateCommandTypes.User = CreateCommandTypes.User;

  constructor(options: UserContextCommandOptions) {
    const { name } = options;

    this._data = {
      name,
    };
  }

  abstract run(options: UserContextCommandRunOptions): Promise<void>;

  // biome-ignore lint/style/useNamingConvention: JSON should be upper case.
  toJSON(): CreateContextApplicationCommand {
    const { name } = this._data;

    return {
      ...mainRegistrationProperties,
      name,
      type: ApplicationCommandTypes.User,
    };
  }
}

/**
 * All options that are available for each command.
 */
type ChatInputCommandOptions = Pick<CreateSlashApplicationCommand, "description" | "descriptionLocalizations" | "name">;
type ChatInputSubCommandOptions = Pick<
  ApplicationCommandOption,
  "description" | "descriptionLocalizations" | "name" | "type"
>;
type UserContextCommandOptions = Pick<CreateContextApplicationCommand, "name">;

/**
 * All the options that are available for each command run function.
 */
export interface CommandRunOptions {
  /**
   * The main client instance.
   */
  client: Client;
  /**
   * The interaction context.
   */
  context: Interaction;
  /**
   * A translation function for multilingual support.
   */
  t: TFunction<Namespace, undefined>;
}

export type ChatInputSubCommandRunOptions = CommandRunOptions;
export type UserContextCommandRunOptions = CommandRunOptions & {
  /**
   * The target user from the user context command.
   */
  targetUser: User;
};
