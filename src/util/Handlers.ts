import type { Discord } from "@client";
import type { Locales } from "@types";
import type {
  AnyInteractionChannel,
  ApplicationCommandTypes,
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
  CreateChatInputApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
  Message,
  MessageComponentTypes,
  PermissionName,
  Uncached,
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
    autoComplete?: (config: {
      client: Discord;
      context: AutocompleteInteraction;
      isPremium: boolean;
      locale: Locales;
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
    context: ChatInputCommandInteraction;
    locale: Locales;
    isPremium: boolean;
    variable?: unknown;
  }) => Promise<unknown>;
}) => createOptions;

export const createUserCommand = (
  createOptions: CreateUserApplicationCommandOptions & {
    run: (config: {
      client: Discord;
      context: UserCommandInteraction;
      locale: Locales;
      isPremium: boolean;
    }) => Promise<unknown>;
  },
) => createOptions;

export const createComponent = (createOptions: {
  developerOnly?: boolean;
  name: string;
  permissions?: {
    bot?: PermissionName[];
    user?: PermissionName[];
  };
  type: MessageComponentTypes;
  run: (config: {
    client: Discord;
    context: ComponentInteraction;
    locale: Locales;
    isPremium: boolean;
    variable: string;
  }) => Promise<unknown>;
}) => createOptions;

export enum CommandCategory {
  CONFIGURATION,
  INFORMATION,
  UTILITY,
}

type ChatInputCommandInteraction = CommandInteraction<
  AnyInteractionChannel | Uncached,
  ApplicationCommandTypes.CHAT_INPUT
>;
type UserCommandInteraction = CommandInteraction<AnyInteractionChannel | Uncached, ApplicationCommandTypes.USER>;
