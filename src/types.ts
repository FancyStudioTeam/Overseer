import type { GuildConfigurationLocale } from "@prisma/client";
import type {
  createButtonComponent,
  createChatInputCommand,
  createChatInputSubCommand,
  createPrefixCommand,
  createUserCommand,
} from "@util/Handlers";

export type Locales = GuildConfigurationLocale;

export type MaybeAwaitable<T> = Promise<T> | T;
export type MaybeNullish<T> = T | null | undefined;

export type ButtonComponentData = ReturnType<typeof createButtonComponent>;
export type ChatInputCommandData = ReturnType<typeof createChatInputCommand>;
export type ChatInputSubCommandData = ReturnType<typeof createChatInputSubCommand>;
export type PrefixCommandData = ReturnType<typeof createPrefixCommand>;
export type UserCommandData = ReturnType<typeof createUserCommand>;
