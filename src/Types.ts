import type {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
  CreateChatInputApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
  ModalSubmitInteraction,
  PermissionName,
} from "oceanic.js";

export type Locales = "EN" | "ES";

interface Base<T extends Interactions> {
  name: string;
  permissions?: {
    bot?: PermissionName[];
    user?: PermissionName[];
  };
  run: (config: {
    context: T;
    locale: Locales;
    timezone: string;
    hour12: boolean;
    premium: boolean;
    variable?: unknown;
  }) => Promise<unknown>;
}

export type ChatInputCommand = {
  directory: Directories;
  autocomplete?: (config: {
    context: AutocompleteInteraction;
    locale: Locales;
    timezone: string;
    hour12: boolean;
    premium: boolean;
  }) => Promise<unknown>;
} & Omit<Base<CommandInteraction>, "run"> &
  CreateChatInputApplicationCommandOptions;

export type ChatInputSubCommand = {
  directory: Directories;
} & Base<CommandInteraction>;

export type UserCommand = Base<CommandInteraction> & CreateUserApplicationCommandOptions;

export type Component = Base<ComponentInteraction>;

export type Modal = Base<ModalSubmitInteraction>;

type Interactions = CommandInteraction | ComponentInteraction | ModalSubmitInteraction;

export enum Directories {
  INFORMATION,
  MODERATION,
  UTILITY,
}
