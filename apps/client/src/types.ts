import type { CreateMessageOptions, DiscordEmbed, InteractionCallbackData } from "@discordeno/bot";
import type { client } from "@index";

export type Interaction = typeof client.transformers.$inferredTypes.interaction;
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
