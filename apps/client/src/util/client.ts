import { DISCORD_TOKEN, PROXY_AUTHORIZATION, PROXY_URL } from "@config";
import {
  type BigString,
  Collection,
  DesiredPropertiesBehavior,
  createBot as createDiscordenoClient,
} from "@discordeno/bot";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";
import type { UserContextCommand } from "@structures/commands/UserContextCommand.js";
import type { User } from "@types";
import { createProxyCache as createClientWithCache } from "dd-cache-proxy";

/**
 * Creates a main Discordeno client object.
 */
const discordenoClient = createDiscordenoClient({
  /**
   * Use "desiredProperties" to select what properties from each object.
   */
  desiredProperties: {
    guild: {
      id: true,
      memberCount: true,
      name: true,
      roles: true,
      shardId: true,
    },
    interaction: {
      channelId: true,
      data: true,
      guild: true,
      guildId: true,
      id: true,
      member: true,
      token: true,
      type: true,
      user: true,
    },
    member: {
      guildId: true,
      id: true,
      permissions: true,
    },
    message: {
      author: true,
      channelId: true,
      content: true,
      id: true,
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
/**
 * Creates a client object with a cache manager.
 */
const clientWithCache = createClientWithCache(discordenoClient, {
  cacheInMemory: {
    default: true,
    guild: true,
    user: true,
  },
});

/**
 * Exports the client object with some additional properties and utilities.
 */
export const client = clientWithCache as Client;

client.applicationCommands = {
  chatInput: new Collection(),
  user: new Collection(),
};
client.fetchUser = async (userIdBigString?: BigString): Promise<User> => {
  const {
    applicationId,
    cache: { users: cachedUsers },
    helpers,
  } = client;
  const userIdString = userIdBigString?.toString() ?? applicationId;
  const userIdBigInt = BigInt(userIdString);
  const cachedUser = await cachedUsers.get(userIdBigInt);

  return cachedUser ? cachedUser : await helpers.getUser(userIdBigInt);
};

export type Client = typeof clientWithCache & {
  applicationCommands: {
    chatInput: Collection<string, ChatInputSubCommand>;
    user: Collection<string, UserContextCommand>;
  };
  fetchUser: (userIdBigString?: BigString) => Promise<User>;
};
