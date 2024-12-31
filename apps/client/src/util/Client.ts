import { DISCORD_TOKEN, PROXY_AUTHORIZATION, PROXY_URL } from "@config";
import { Collection, DesiredPropertiesBehavior, createBot } from "@discordeno/bot";
import type { PrismaClient } from "@prisma/client";
import { overrideGateway } from "@utils";
import { prisma } from "./Prisma.js";

const rawClient = createBot({
  desiredProperties: {
    interaction: {
      id: true,
      token: true,
    },
    message: {
      author: true,
      content: true,
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

client.commands = new Collection();
client.prisma = prisma;

overrideGateway(client);

export type Client = typeof rawClient & {
  commands: Collection<string, unknown>;
  prisma: PrismaClient;
};
