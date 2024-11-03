import type { Discord } from "@client";
import type { Locales } from "@types";
import {
  type AnyTextableGuildChannel,
  type ApplicationCommandTypes,
  type AutocompleteInteraction,
  type CommandInteraction,
  type ComponentInteraction,
  ComponentTypes,
  type CreateChatInputApplicationCommandOptions,
  type CreateMessageApplicationCommandOptions,
  type CreateUserApplicationCommandOptions,
  type Message,
  type PermissionName,
} from "oceanic.js";

export const createPrefixCommand = (createOptions: {
  developerOnly?: boolean;
  name: string;
  run: (config: {
    args: string[];
    client: Discord;
    context: PrefixCommandMessage;
    isPremium: boolean;
    locale: Locales;
  }) => Promise<unknown>;
}) => createOptions;

export const createChatInputCommand = (
  createOptions: CreateChatInputApplicationCommandOptions & {
    autoComplete?: (config: {
      client: Discord;
      context: AutoCompleteInteraction;
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

export const createMessageCommand = (
  createOptions: CreateMessageApplicationCommandOptions & {
    run: (config: {
      client: Discord;
      context: MessageCommandInteraction;
      locale: Locales;
      isPremium: boolean;
    }) => Promise<unknown>;
  },
) => createOptions;

export const createButtonComponent = (createOptions: {
  developerOnly?: boolean;
  name: string;
  permissions?: {
    bot?: PermissionName[];
    user?: PermissionName[];
  };
  run: (config: {
    client: Discord;
    context: ButtonComponentInteraction;
    locale: Locales;
    isPremium: boolean;
    variable: string;
  }) => Promise<unknown>;
}) => ({
  ...createOptions,
  type: ComponentTypes.BUTTON,
});

export enum CommandCategory {
  CONFIGURATION,
  INFORMATION,
  UTILITY,
}

type AutoCompleteInteraction = AutocompleteInteraction<AnyTextableGuildChannel>;
type ButtonComponentInteraction = ComponentInteraction<ComponentTypes.BUTTON, AnyTextableGuildChannel>;
type ChatInputCommandInteraction = CommandInteraction<AnyTextableGuildChannel, ApplicationCommandTypes.CHAT_INPUT>;
type MessageCommandInteraction = CommandInteraction<AnyTextableGuildChannel, ApplicationCommandTypes.MESSAGE>;
type PrefixCommandMessage = Message<AnyTextableGuildChannel>;
type UserCommandInteraction = CommandInteraction<AnyTextableGuildChannel, ApplicationCommandTypes.USER>;
