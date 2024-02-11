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

export enum LogType {
  Info = "Info",
  Debug = "Debug",
  Request = "Request",
  Error = "Error",
  Warn = "Warn",
  Database = "Database",
}

export enum WebhookType {
  Reports = "Reports",
  Logs = "Logs",
  GuildLogs = "GuildLogs",
}

export enum UnixType {
  Default = "Default",
  Relative = "Relative",
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
      language: string;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    },
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
      language: string;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    },
  ) => Promise<unknown>;
}

export type UserCommandInterface = {
  run: (
    client: Fancycord,
    interaction: CommandInteraction,
    config: {
      language: string;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    },
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
      language: string;
      timezone: string;
      hour12: boolean;
      premium: boolean;
      variable?: string;
    },
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
      language: string;
      timezone: string;
      hour12: boolean;
      premium: boolean;
    },
  ) => Promise<unknown>;
}

export interface Config {
  colors: {
    color: number;
    success: number;
    error: number;
    warning: number;
  };
  links: {
    invite: string;
    support: string;
  };
}

export interface WeatherInfo {
  weatherlocationcode: string;
  weatherlocationname: string;
  url: string;
  imagerelativeurl: string;
  degreetype: "C" | "F";
  provider: string;
  attribution: string;
  attribution2: string;
  lat: string;
  long: string;
  timezone: string;
  alert: string;
  entityid: string;
  encodedlocationname: string;
}

export interface WeatherCurrent {
  temperature: string;
  skycode: string;
  skytext: string;
  date: string;
  observationtime: string;
  observationpoint: string;
  feelslike: string;
  humidity: string;
  winddisplay: string;
  daylight: string;
  shorday: string;
  windspeed: string;
}

export interface WeatherForecast {
  low: string;
  high: string;
  skycodeday: string;
  skytextday: string;
  date: string;
  day: string;
  shortday: string;
  precip: string;
}
