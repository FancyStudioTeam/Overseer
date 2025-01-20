import type { CreateMessageOptions, DiscordEmbed, InteractionCallbackData } from "@discordeno/bot";
import type { Client, client } from "@index";
import type { Namespace, TFunction } from "i18next";

export type Guild = typeof client.transformers.$inferredTypes.guild;
export type Interaction = typeof client.transformers.$inferredTypes.interaction;
export type Member = typeof client.transformers.$inferredTypes.member;
export type Message = typeof client.transformers.$inferredTypes.message;
export type User = typeof client.transformers.$inferredTypes.user;

export type AnyContext = Message | Interaction;

export type MessagePayload = CreateMessageOptions & InteractionCallbackData;
export type AnyMessagePayload = string | DiscordEmbed | MessagePayload;

export enum CreateCommandTypes {
  ChatInput = "ChatInput",
  Message = "Message",
  User = "User",
}

export type MaybeAwaitable<T> = T | Promise<T>;
export type MaybeNullish<T> = T | null | undefined;

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
   * A translation function for multilingual support.
   */
  t: TFunction<Namespace, undefined>;
}
