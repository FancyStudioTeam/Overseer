import {
  type BigString,
  Collection,
  DesiredPropertiesBehavior,
  createBot as createDiscordenoClient,
} from "@discordeno/bot";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";
import type { UserContextCommand } from "@structures/commands/UserContextCommand.js";
import type { ButtonComponent } from "@structures/components/ButtonComponent.js";
import type { ModalComponent } from "@structures/components/ModalComponent.js";
import { DISCORD_TOKEN, PROXY_AUTHORIZATION, PROXY_URL } from "@util/config.js";
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

export const client = discordenoClient as Client;

client.applicationCommands = {
  chatInput: new Collection(),
  userContext: new Collection(),
};
client.components = {
  buttons: new Collection(),
  modals: new Collection(),
};

client.fetchMember = async (guildIdBigString: BigString, memberIdBigString: BigString): Promise<Member> => {
  const { helpers } = client;
  const guildIdBigInt = BigInt(guildIdBigString.toString());
  const memberIdString = memberIdBigString.toString();
  const memberIdBigInt = BigInt(memberIdString);

  return await helpers.getMember(guildIdBigInt, memberIdBigInt);
};

client.fetchUser = async (userIdBigString: BigString): Promise<User> => {
  const { helpers } = client;
  const userIdString = userIdBigString.toString();
  const userIdBigInt = BigInt(userIdString);

  return await helpers.getUser(userIdBigInt);
};

export type Client = typeof discordenoClient & {
  /** The application command collections. */
  applicationCommands: {
    chatInput: Collection<string, ChatInputSubCommand>;
    userContext: Collection<string, UserContextCommand>;
  };
  /** The component collections. */
  components: {
    buttons: Collection<string, ButtonComponent>;
    modals: Collection<string, ModalComponent>;
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
