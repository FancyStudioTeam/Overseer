import { DISCORD_TOKEN, PROXY_AUTHORIZATION, PROXY_URL } from "@config";
import {
  type BigString,
  Collection,
  DesiredPropertiesBehavior,
  createBot as createDiscordenoClient,
} from "@discordeno/bot";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";
import type { UserContextCommand } from "@structures/commands/UserContextCommand.js";
import type { Member, User } from "@types";
import { createProxyCache as createClientWithCache } from "dd-cache-proxy";

/** Create the main Discordeno client object. */
const discordenoClient = createDiscordenoClient({
  /**
   * The "desiredProperties" option is used to specify the properties that we actually use in our code.
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
  /** Used to explain why the the property is disabled in a string. */
  desiredPropertiesBehavior: DesiredPropertiesBehavior.ChangeType,
  rest: {
    proxy: {
      authorization: PROXY_AUTHORIZATION,
      baseUrl: `${PROXY_URL}/rest`,
    },
  },
  token: DISCORD_TOKEN,
});
/** Create the main client object with a cache manager. */
const clientWithCache = createClientWithCache(discordenoClient, {
  cacheInMemory: {
    default: true,
    guild: true,
    user: true,
  },
});

export const client = clientWithCache as Client;

client.applicationCommands = {
  chatInput: new Collection(),
  user: new Collection(),
};

client.fetchMember = async (guildIdBigString: BigString, memberIdBigString?: BigString): Promise<Member> => {
  const {
    applicationId,
    cache: { members: cachedMembers },
    helpers,
  } = client;
  const guildIdBigInt = BigInt(guildIdBigString.toString());
  const memberIdString = memberIdBigString?.toString() ?? applicationId.toString();
  const memberIdBigInt = BigInt(memberIdString);
  const cachedMember = await cachedMembers.get(guildIdBigInt, memberIdBigInt);

  return cachedMember ? cachedMember : await helpers.getMember(guildIdBigInt, memberIdBigInt);
};

client.fetchUser = async (userIdBigString?: BigString): Promise<User> => {
  const {
    applicationId,
    cache: { users: cachedUsers },
    helpers,
  } = client;
  const userIdString = userIdBigString?.toString() ?? applicationId.toString();
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
   * Fetch the member from the cache or Discord API.
   * @param guildIdBigString The guild ID as BigString.
   * @param memberIdBigString The member ID as BigString.
   * @returns The fetched member.
   */
  fetchMember: (guildIdBigString: BigString, memberIdBigString?: BigString) => Promise<Member>;
  /**
   * Fetch the user from the cache or Discord API.
   * @param userIdBigString The user ID as BigString.
   * @returns The fetched user.
   */
  fetchUser: (userIdBigString?: BigString) => Promise<User>;
};
