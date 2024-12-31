import { DISCORD_TOKEN, PROXY_AUTHORIZATION, PROXY_URL } from "@config";
import { Collection, DesiredPropertiesBehavior, createBot } from "@discordeno/bot";
import { overrideGateway } from "@utils";

const rawClient = createBot({
  desiredProperties: {
    interaction: {
      id: true,
      token: true,
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

overrideGateway(client);

export type Client = typeof rawClient & {
  commands: Collection<string, unknown>;
};
