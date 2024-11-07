import type { GuildConfigurationLocale } from "@prisma/client";
import type {
  createButtonComponent,
  createChatInputCommand,
  createChatInputSubCommand,
  createMessageCommand,
  createPrefixCommand,
  createSelectMenuComponent,
  createUserCommand,
} from "@util/Handlers";
import type { CreateMessageOptions, InteractionContent } from "oceanic.js";

export type Locales = GuildConfigurationLocale;

export type MaybeAwaitable<T> = Promise<T> | T;
export type MaybeNullish<T> = T | null | undefined;

export type ButtonComponentData = ReturnType<typeof createButtonComponent>;
export type ChatInputCommandData = ReturnType<typeof createChatInputCommand>;
export type ChatInputSubCommandData = ReturnType<typeof createChatInputSubCommand>;
export type MessageCommandData = ReturnType<typeof createMessageCommand>;
export type PrefixCommandData = ReturnType<typeof createPrefixCommand>;
export type SelectMenuComponentData = ReturnType<typeof createSelectMenuComponent>;
export type UserCommandData = ReturnType<typeof createUserCommand>;

export type MessagePayload = CreateMessageOptions & InteractionContent;
