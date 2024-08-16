import type {
  AutocompleteInteraction,
  CommandInteraction,
  CreateChatInputApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
  PermissionName,
} from "oceanic.js";
import type { Locales } from "#types";

export const createChatInput = (
  createOptions: CreateChatInputApplicationCommandOptions & {
    autocomplete?: (config: {
      context: AutocompleteInteraction;
      hour12: boolean;
      locale: Locales;
      premium: boolean;
      timezone: string;
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
    hour12: boolean;
    locale: Locales;
    premium: boolean;
    timezone: string;
    variable?: unknown;
  }) => Promise<unknown>;
}) => createOptions;

export const createUserCommand = (
  createOptions: CreateUserApplicationCommandOptions & {
    run: (config: {
      context: CommandInteraction;
      hour12: boolean;
      locale: Locales;
      premium: boolean;
      timezone: string;
    }) => Promise<unknown>;
  },
) => createOptions;
