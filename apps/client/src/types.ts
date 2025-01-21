import type { CreateMessageOptions, DiscordEmbed, InteractionCallbackData } from "@discordeno/bot";
import type { Client, client } from "@index";
import type { TFunction } from "i18next";

export type Guild = typeof client.transformers.$inferredTypes.guild;
export type Interaction = typeof client.transformers.$inferredTypes.interaction;
export type Member = typeof client.transformers.$inferredTypes.member;
export type Message = typeof client.transformers.$inferredTypes.message;
export type User = typeof client.transformers.$inferredTypes.user;

export type AnyContext = Message | Interaction;

export type MessagePayload = CreateMessageOptions & InteractionCallbackData;
export type AnyMessagePayload = string | DiscordEmbed | MessagePayload;

/**
 * Internally used to identify the command type when creating a new command.
 */
export enum CreateCommandTypes {
  ChatInput = "ChatInput",
  Message = "Message",
  User = "User",
}

export type MaybeAwaitable<T> = T | Promise<T>;
export type MaybeNullable<T> = T | null;
export type MaybeNullish<T> = T | null | undefined;
export type MaybeOptional<T> = T | undefined;

export interface DefaultRunnableOptions {
  /**
   * The main client object.
   */
  client: Client;
  /**
   * The interaction context.
   */
  context: Interaction;
  /**
   * The translation function to translate command messages.
   */
  t: TFunction<"commands", undefined>;
}
