import type {
  AutocompleteInteraction,
  CommandInteraction,
  ComponentInteraction,
  CreateChatInputApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
  ModalSubmitInteraction,
  PermissionName,
} from "oceanic.js";
import type { Fancycord } from "./classes/Client";

export type Locales = "EN" | "ES";

// biome-ignore lint/style/useEnumInitializers:
export enum MembershipType {
  MONTH,
  INFINITE,
}

// biome-ignore lint/style/useEnumInitializers:
export enum WebhookType {
  REPORTS,
  LOGS,
}

// biome-ignore lint/style/useEnumInitializers:
export enum LoggerType {
  ERROR,
  DEBUG,
  WARN,
  INFO,
  REQUEST,
}

// biome-ignore lint/style/useEnumInitializers:
export enum ComparationLevel {
  UNKNOWN,
  LOWER,
  EQUAL,
  HIGHER,
}

// biome-ignore lint/style/useEnumInitializers:
export enum UnixType {
  SHORT_TIME,
  SHORT_DATE,
  RELATIVE,
  SHORT_DATE_TIME,
  LONG_DATE_TIME,
}

export type ChatInputCommandInterface = {
  directory: string;
  permissions?: {
    bot?: PermissionName;
    user?: PermissionName;
  };
  id?: string;
  run?: (
    client: Fancycord,
    interaction: CommandInteraction,
    config: {
      locale: Locales;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    }
  ) => Promise<unknown>;
  autocomplete?: (interaction: AutocompleteInteraction) => unknown;
} & CreateChatInputApplicationCommandOptions;

export interface SubCommandInterface {
  name: string;
  permissions?: {
    bot?: PermissionName;
    user?: PermissionName;
  };
  run: (
    client: Fancycord,
    interaction: CommandInteraction,
    config: {
      locale: Locales;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    }
  ) => Promise<unknown>;
}

export type UserCommandInterface = {
  run: (
    client: Fancycord,
    interaction: CommandInteraction,
    config: {
      locale: Locales;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    }
  ) => Promise<unknown>;
} & CreateUserApplicationCommandOptions;

export interface ComponentInterface {
  name: string;
  permissions?: {
    bot?: PermissionName;
    user?: PermissionName;
  };
  run: (
    client: Fancycord,
    interaction: ComponentInteraction,
    config: {
      locale: Locales;
      timezone: string;
      hour12: boolean;
      premium: boolean;
      variable?: string;
    }
  ) => Promise<unknown>;
}

export interface ModalInterface {
  name: string;
  permissions?: {
    bot?: PermissionName;
    user?: PermissionName;
  };
  run: (
    client: Fancycord,
    interaction: ModalSubmitInteraction,
    config: {
      locale: Locales;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    }
  ) => Promise<unknown>;
}
