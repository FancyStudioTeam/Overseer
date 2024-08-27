import type {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
  CreateChatInputApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
  Message,
  PermissionName,
} from "oceanic.js";
import type { Locales } from "#types";

export const createPrefixCommand = (createOptions: {
  name: string;
  run: (config: {
    args: string[];
    context: Message;
  }) => Promise<unknown>;
}) => createOptions;

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

export const createComponent = (createOptions: {
  name: string;
  run: (config: {
    context: ComponentInteraction;
    locale: Locales;
    premium: boolean;
    variable?: unknown;
  }) => Promise<unknown>;
}) => createOptions;
