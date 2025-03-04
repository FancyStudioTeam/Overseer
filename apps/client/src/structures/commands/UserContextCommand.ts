import {
  ApplicationCommandTypes,
  type CreateContextApplicationCommand,
  DiscordApplicationIntegrationType,
  DiscordInteractionContextType,
  avatarUrl as getAvatarUrl,
} from "@discordeno/bot";
import { client } from "@util/client.js";
import type { RunnableInstanceOptions } from "@util/decorators.js";
import type { DefaultRunnableOptions, MaybeOptional, Member, User } from "@util/types.js";

export abstract class UserContextCommand {
  _declareDecoratorData: Partial<UserContextCommandOptions> = {};
  _instanceOptions: Partial<RunnableInstanceOptions> = {};

  abstract _run(options: UserContextCommandRunOptions): Promise<unknown>;

  /**
   * Gets the avatar url of the user.
   * @param user - The user object.
   * @returns The avatar url of the user.
   */
  async getAvatarUrl(user?: User): Promise<string> {
    const { applicationId, fetchUser } = client;
    const targetUser = user ?? (await fetchUser(applicationId));
    const { avatar, discriminator, id } = targetUser;
    const avatarUrl = getAvatarUrl(id, discriminator, {
      avatar,
      size: 1024,
    });

    return avatarUrl;
  }

  /**
   * Gets the JSON representation of the command instance.
   * @returns A compatible object with the Discord API.
   */
  toJSON(): CreateContextApplicationCommand {
    const { name } = this._declareDecoratorData;

    return {
      contexts: [DiscordInteractionContextType.Guild],
      integrationTypes: [DiscordApplicationIntegrationType.GuildInstall],
      name: name ?? "",
      nsfw: false,
      type: ApplicationCommandTypes.User,
    };
  }
}

export type UserContextCommandOptions = Pick<CreateContextApplicationCommand, "name">;

export type UserContextCommandRunOptions = DefaultRunnableOptions & {
  /** The target member from the user context command, if present. */
  targetMember: MaybeOptional<Member>;
  /** The target user from the user context command. */
  targetUser: User;
};
