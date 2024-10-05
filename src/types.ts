import type {
  createChatInputCommand,
  createChatInputSubCommand,
  createComponent,
  createPrefixCommand,
  createUserCommand,
} from "@util/Handlers";

export type Locales = "EN" | "ES";

export type MaybeNullish<T> = T | null | undefined;
export type Awaitable<T> = Promise<T> | T;

export type ChatInputCommandData = Parameters<typeof createChatInputCommand>[0];
export type ChatInputSubCommandData = Parameters<typeof createChatInputSubCommand>[0];
export type PrefixCommandData = Parameters<typeof createPrefixCommand>[0];
export type UserCommandData = Parameters<typeof createUserCommand>[0];
export type ComponentData = Parameters<typeof createComponent>[0];
