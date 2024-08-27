import type {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
  ComponentTypes,
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
  type: Exclude<
    ComponentTypes,
    | ComponentTypes.ACTION_ROW
    | ComponentTypes.CONTENT_INVENTORY_ENTRY
    | ComponentTypes.MEDIA_GALLERY
    | ComponentTypes.SEPARATOR
    | ComponentTypes.TEXT
    | ComponentTypes.TEXT_INPUT
  >;
  run: (config: {
    context: ComponentInteraction;
    locale: Locales;
    premium: boolean;
    variable?: unknown;
  }) => Promise<unknown>;
}) => createOptions;
