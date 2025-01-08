import "dotenv/config";
import "@api";
import { join } from "node:path";
import { DISCORD_TOKEN, PROXY_AUTHORIZATION, PROXY_URL } from "@config";
import { Collection, DesiredPropertiesBehavior, createBot } from "@discordeno/bot";
import type { CreateMessageCommand, CreateUserCommand } from "@types";
import { getDirnameFromFileUrl, importDirectory, overrideGateway } from "@utils";

const rawClient = createBot({
  desiredProperties: {
    interaction: {
      channelId: true,
      data: true,
      guildId: true,
      id: true,
      token: true,
      type: true,
    },
    message: {
      author: true,
      channelId: true,
      content: true,
    },
    user: {
      avatar: true,
      discriminator: true,
      id: true,
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
  message: new Collection(),
  user: new Collection(),
};

overrideGateway(client);

export type Client = typeof rawClient & {
  commands: {
    message: Collection<string, CreateMessageCommand>;
    user: Collection<string, CreateUserCommand>;
  };
};

const currentFolder = getDirnameFromFileUrl(import.meta.url);

await importDirectory(join(currentFolder, "events"));
await importDirectory(join(currentFolder, "commands"));
