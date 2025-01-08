import type { CreateMessageOptions, DiscordEmbed, InteractionCallbackData } from "@discordeno/bot";
import type { Client, client } from "@index";
import type { Namespace, TFunction } from "i18next";

export type Interaction = typeof client.transformers.$inferredTypes.interaction;
export type Message = typeof client.transformers.$inferredTypes.message;
export type User = typeof client.transformers.$inferredTypes.user;

export type AnyContext = Message | Interaction;

export type MessagePayload = CreateMessageOptions & InteractionCallbackData;
export type AnyMessagePayload = string | DiscordEmbed | MessagePayload;

interface CreateAnyRunnableOptions {
  name: string;
}

export interface CreateMessageCommandOptions extends CreateAnyRunnableOptions {
  run: ({
    client,
    context,
    t,
    targetMessage,
  }: {
    client: Client;
    context: Interaction;
    t: TFunction<Namespace, undefined>;
    targetMessage: Message;
  }) => Promise<unknown>;
}

export interface CreateUserCommandOptions extends CreateAnyRunnableOptions {
  run: ({
    client,
    context,
    t,
    targetUser,
  }: {
    client: Client;
    context: Interaction;
    t: TFunction<Namespace, undefined>;
    targetUser: User;
  }) => Promise<unknown>;
}

export interface CreateMessageCommand extends CreateMessageCommandOptions {
  type: CreateCommandTypes.Message;
}

export interface CreateUserCommand extends CreateUserCommandOptions {
  type: CreateCommandTypes.User;
}

export enum CreateCommandTypes {
  Message = "Message",
  User = "User",
}
