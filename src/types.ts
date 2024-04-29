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

export enum MembershipType {
  MONTH,
  INFINITE,
}

export enum WebhookType {
  REPORTS,
  LOGS,
}

export enum LoggerType {
  ERROR,
  DEBUG,
  WARN,
  INFO,
  REQUEST,
}

export enum ComparationLevel {
  UNKNOWN,
  LOWER,
  EQUAL,
  HIGHER,
}

export enum UnixType {
  SHORT_TIME,
  SHORT_DATE,
  RELATIVE,
  SHORT_DATE_TIME,
  LONG_DATE_TIME,
}

export interface BaseInterface<
  T extends BaseAvailableTypes = BaseAvailableTypes
> {
  name: string;
  permissions?: {
    bot?: PermissionName;
    user?: PermissionName;
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
    }
  ) => Promise<unknown>;
}

export type ChatInputCommandInterface = {
  directory: string;
  autocomplete?: (
    client: Discord,
    interaction: AutocompleteInteraction,
    config: {
      locale: Locales;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    }
  ) => Promise<unknown>;
} & BaseInterface<CommandInteraction> &
  CreateChatInputApplicationCommandOptions;

export type SubCommandInterface = BaseInterface<CommandInteraction>;

export type UserCommandInterface = BaseInterface<CommandInteraction> &
  CreateUserApplicationCommandOptions;

export type ComponentInterface = BaseInterface<ComponentInteraction>;

export type ModalInterface = BaseInterface<ModalSubmitInteraction>;

type BaseAvailableTypes =
  | CommandInteraction
  | ComponentInteraction
  | ModalSubmitInteraction;
