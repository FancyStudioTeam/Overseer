import type {
  AnyInteractionChannel,
  ApplicationCommandTypes,
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
  CreateChatInputApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
  ModalSubmitInteraction,
  PermissionName,
  Uncached,
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
  MISC,
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
} & BaseInterface<
  CommandInteraction<
    AnyInteractionChannel | Uncached,
    ApplicationCommandTypes.CHAT_INPUT
  >
> &
  CreateChatInputApplicationCommandOptions;

export type SubCommandInterface = BaseInterface<
  CommandInteraction<
    AnyInteractionChannel | Uncached,
    ApplicationCommandTypes.CHAT_INPUT
  >
>;

export type UserCommandInterface = BaseInterface<
  CommandInteraction<
    AnyInteractionChannel | Uncached,
    ApplicationCommandTypes.USER
  >
> &
  CreateUserApplicationCommandOptions;

export type ComponentInterface = BaseInterface<ComponentInteraction>;

export type ModalInterface = BaseInterface<ModalSubmitInteraction>;

type BaseAvailableTypes =
  | CommandInteraction<
      AnyInteractionChannel | Uncached,
      | ApplicationCommandTypes.CHAT_INPUT
      | ApplicationCommandTypes.USER
      | ApplicationCommandTypes.MESSAGE
    >
  | ComponentInteraction
  | ModalSubmitInteraction;
