import type {
  AutocompleteInteraction,
  CommandInteraction,
  CreateChatInputApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
  Message,
  PermissionName,
} from "oceanic.js";
import type { Locales } from "#types";

export const createPrefixCommand = (
  createOptions: CreateUserApplicationCommandOptions & {
    run: (config: {
      context: Message;
      locale: Locales;
      premium: boolean;
    }) => Promise<unknown>;
  },
) => createOptions;

export const createChatInputCommand = (
  createOptions: CreateChatInputApplicationCommandOptions & {
    autocomplete?: (config: {
      context: AutocompleteInteraction;
      locale: Locales;
      premium: boolean;
    }) => Promise<unknown>;
  },
) => createOptions;

export const createChatInputSubCommand = (createOptions: {
  name: string;
  permissions?: {
    bot?: PermissionName[];
    user?: PermissionName[];
  };
  run: (config: {
    context: CommandInteraction;
    locale: Locales;
    premium: boolean;
    variable?: unknown;
  }) => Promise<unknown>;
}) => createOptions;

export const createUserCommand = (
  createOptions: CreateUserApplicationCommandOptions & {
    run: (config: {
      context: CommandInteraction;
      locale: Locales;
      premium: boolean;
    }) => Promise<unknown>;
  },
) => createOptions;
