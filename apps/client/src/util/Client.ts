import { DISCORD_TOKEN, PROXY_AUTHORIZATION, PROXY_URL } from "@config";
import { Collection, DesiredPropertiesBehavior, createBot } from "@discordeno/bot";
import { overrideGateway } from "@utils";
import type { CreateMessageCommand } from "./Handlers.js";

const rawClient = createBot({
  desiredProperties: {
    interaction: {
      channelId: true,
      data: true,
      id: true,
      token: true,
      type: true,
      guildId: true,
    },
    message: {
      author: true,
      content: true,
      channelId: true,
    },
    user: {
      username: true,
    },
  },
  desiredPropertiesBehavior: DesiredPropertiesBehavior.ChangeType,
  rest: {
    proxy: {
      authorization: PROXY_AUTHORIZATION,
      baseUrl: `${PROXY_URL}/rest`,
    },
  },
  token: DISCORD_TOKEN,
});

export const client = rawClient as Client;

client.commands = {
  chatInput: new Collection(),
  message: new Collection(),
};

overrideGateway(client);

export type Client = typeof rawClient & {
  commands: {
    chatInput: Collection<string, unknown>;
    message: Collection<string, CreateMessageCommand>;
  };
};
