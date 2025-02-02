import type { CreateMessageOptions, DiscordEmbed, InteractionCallbackData } from "@discordeno/bot";

export type MessagePayload = CreateMessageOptions & InteractionCallbackData;

export type AnyMessagePayload = string | DiscordEmbed | MessagePayload;
