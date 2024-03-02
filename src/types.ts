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

export type Locales = "EN" | "ES" | "GL";

export enum WebhookType {
  REPORTS = "REPORTS",
  LOGS = "LOGS",
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
