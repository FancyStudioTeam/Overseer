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

export interface BaseInterface<T extends Interactions> {
  name: string;
  permissions?: {
    bot?: PermissionName[];
    user?: PermissionName[];
  };
  run: (
    interaction: T,
    config: {
      locale: Locales;
      timezone: string;
      hour12: boolean;
      premium: boolean;
      variable?: unknown;
    },
  ) => Promise<unknown>;
}

export type ChatInputCommandInterface = {
  directory: Directories;
  autocomplete?: (
    interaction: AutocompleteInteraction,
    config: {
      locale: Locales;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    },
  ) => Promise<unknown>;
} & Omit<BaseInterface<CommandInteraction>, "run"> &
  CreateChatInputApplicationCommandOptions;

export type ChatInputSubCommandInterface = {
  directory: Directories;
} & BaseInterface<CommandInteraction>;

export type UserCommandInterface = BaseInterface<CommandInteraction> & CreateUserApplicationCommandOptions;

export type ComponentInterface = BaseInterface<ComponentInteraction>;

export type ModalInterface = BaseInterface<ModalSubmitInteraction>;

type Interactions = CommandInteraction | ComponentInteraction | ModalSubmitInteraction;

export enum Directories {
  INFORMATION,
  MODERATION,
  UTILITY,
}
