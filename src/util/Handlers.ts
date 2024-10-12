import type { Discord } from "@client";
import type { Locales } from "@types";
import type {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
  CreateChatInputApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
  Message,
  MessageComponentTypes,
  PermissionName,
} from "oceanic.js";

export const createPrefixCommand = (createOptions: {
  developerOnly?: boolean;
  name: string;
  run: (config: {
    args: string[];
    client: Discord;
    context: Message;
  }) => Promise<unknown>;
}) => createOptions;

export const createChatInputCommand = (
  createOptions: CreateChatInputApplicationCommandOptions & {
    autocomplete?: (config: {
      client: Discord;
      context: AutocompleteInteraction;
      locale: Locales;
      premium: boolean;
    }) => Promise<unknown>;
  },
) => createOptions;

export const createChatInputSubCommand = (createOptions: {
  category: CommandCategory;
  name: string;
  permissions?: {
    bot?: PermissionName[];
    user?: PermissionName[];
  };
  run: (config: {
    client: Discord;
    context: CommandInteraction;
    locale: Locales;
    premium: boolean;
    variable?: unknown;
  }) => Promise<unknown>;
}) => createOptions;

export const createUserCommand = (
  createOptions: CreateUserApplicationCommandOptions & {
    run: (config: {
      client: Discord;
      context: CommandInteraction;
      locale: Locales;
      premium: boolean;
    }) => Promise<unknown>;
  },
) => createOptions;

export const createComponent = (createOptions: {
  developerOnly?: boolean;
  name: string;
  type: MessageComponentTypes;
  run: (config: {
    client: Discord;
    context: ComponentInteraction;
    locale: Locales;
    premium: boolean;
    variable?: unknown;
  }) => Promise<unknown>;
}) => createOptions;

export enum CommandCategory {
  CONFIGURATION,
  INFORMATION,
  UTILITY,
}
