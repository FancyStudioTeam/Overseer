import type { Camelize, CreateMessageOptions, DiscordEmbed, InteractionCallbackData } from "@discordeno/bot";
import type { GuildPreferencesLocale } from "@prisma/client";
import { client } from "@util/client.js";
import type { TFunction } from "i18next";

const { transformers } = client;
const { $inferredTypes } = transformers;
const { guild, interaction, member, message, user } = $inferredTypes;

export type Locales = GuildPreferencesLocale;

export type Guild = typeof guild;
export type Interaction = typeof interaction;
export type Member = typeof member;
export type Message = typeof message;
export type User = typeof user;

export type MessagePayload = CreateMessageOptions & InteractionCallbackData;

export type AnyContext = Message | Interaction;
export type AnyMessagePayload = string | CamelizedDiscordEmbed | MessagePayload;

export type MaybeAwaitable<T> = T | Promise<T>;
export type MaybeNullable<T> = T | null;
export type MaybeNullish<T> = T | null | undefined;
export type MaybeOptional<T> = T | undefined;

export interface DefaultRunnableOptions {
  /** The interaction context object. */
  context: Interaction;
  /** The function to translate the command messages. */
  t: TCommands;
}

export type CamelizedDiscordEmbed = Camelize<DiscordEmbed>;

export type TCommands = TFunction<"commands">;
export type TCommon = TFunction<"common">;
