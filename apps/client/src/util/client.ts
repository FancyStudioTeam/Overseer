import {
  type BigString,
  Collection,
  DesiredPropertiesBehavior,
  createBot as createDiscordenoClient,
} from "@discordeno/bot";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";
import type { UserContextCommand } from "@structures/commands/UserContextCommand.js";
import { DISCORD_TOKEN, PROXY_AUTHORIZATION, PROXY_URL } from "@util/config.js";
import { createProxyCache as createClientWithCache } from "dd-cache-proxy";
import type { Member, User } from "./types.js";

const discordenoClient = createDiscordenoClient({
  /**
   * Desired properties object is used to specify the properties that we actually use in our bot.
   * Mostly used for properties that we actually want to cache.
   * Documentation: https://discordeno.js.org/docs/desired-properties
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
      roles: true,
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
const clientWithCache = createClientWithCache(discordenoClient, {
  cacheInMemory: {
    default: true,
    guild: true,
    user: true,
  },
  cacheOutsideMemory: {
    default: false,
  },
});

export const client = clientWithCache as Client;

client.applicationCommands = {
  chatInput: new Collection(),
  user: new Collection(),
};

client.fetchMember = async (guildIdBigString: BigString, memberIdBigString: BigString): Promise<Member> => {
  const { cache, helpers } = client;
  const { members: cachedMembers } = cache;
  const guildIdBigInt = BigInt(guildIdBigString.toString());
  const memberIdString = memberIdBigString.toString();
  const memberIdBigInt = BigInt(memberIdString);
  const cachedMember = await cachedMembers.get(guildIdBigInt, memberIdBigInt);

  return cachedMember ? cachedMember : await helpers.getMember(guildIdBigInt, memberIdBigInt);
};

client.fetchUser = async (userIdBigString: BigString): Promise<User> => {
  const { cache, helpers } = client;
  const { users: cachedUsers } = cache;
  const userIdString = userIdBigString.toString();
  const userIdBigInt = BigInt(userIdString);
  const cachedUser = await cachedUsers.get(userIdBigInt);

  return cachedUser ? cachedUser : await helpers.getUser(userIdBigInt);
};

export type Client = typeof clientWithCache & {
  /** The application command collections. */
  applicationCommands: {
    chatInput: Collection<string, ChatInputSubCommand>;
    user: Collection<string, UserContextCommand>;
  };
  /**
   * Fetchs the member from the cache or Discord API.
   * @param guildIdBigString - The guild id as BigString.
   * @param memberIdBigString - The member id as BigString.
   * @returns The fetched member object.
   */
  fetchMember: (guildIdBigString: BigString, memberIdBigString: BigString) => Promise<Member>;
  /**
   * Fetchs the user from the cache or Discord API.
   * @param userIdBigString - The user id as BigString.
   * @returns The fetched user object.
   */
  fetchUser: (userIdBigString: BigString) => Promise<User>;
};
