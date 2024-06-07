import type {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
  CreateChatInputApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
  ModalSubmitInteraction,
  PermissionName,
} from "oceanic.js";
import type { Discord } from "./classes/Client";

export type Locales = "EN" | "ES";

export interface BaseInterface<T extends BaseTypes> {
  name: string;
  permissions?: {
    bot?: PermissionName[];
    user?: PermissionName[];
  };
  run: (
    client: Discord,
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
  directory: Directory;
  autocomplete?: (
    client: Discord,
    interaction: AutocompleteInteraction,
    config: {
      locale: Locales;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    },
  ) => Promise<unknown>;
} & BaseInterface<CommandInteraction> &
  CreateChatInputApplicationCommandOptions;

export type ChatInputSubCommandInterface = {
  directory: Directory;
} & BaseInterface<CommandInteraction>;

export type UserCommandInterface = BaseInterface<CommandInteraction> & CreateUserApplicationCommandOptions;

export type ComponentInterface = BaseInterface<ComponentInteraction>;

export type ModalInterface = BaseInterface<ModalSubmitInteraction>;

type BaseTypes = CommandInteraction | ComponentInteraction | ModalSubmitInteraction;

export enum Directory {
  CONFIGURATION,
  INFORMATION,
  MISCELLANEOUS,
  MODERATION,
  UTILITY,
}
