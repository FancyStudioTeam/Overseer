import type { CommandInteraction, ComponentInteraction, ModalSubmitInteraction, PermissionName } from "oceanic.js";

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

export type MaybeNullish<T> = T | null | undefined;

export type Awaitable<T> = Promise<T> | T;

export type Component = Base<ComponentInteraction>;

export type Modal = Base<ModalSubmitInteraction>;

type Interactions = CommandInteraction | ComponentInteraction | ModalSubmitInteraction;

export enum Directories {
  INFORMATION,
  MODERATION,
  UTILITY,
}
