import {
  ApplicationCommandTypes,
  type CreateContextApplicationCommand,
  DiscordApplicationIntegrationType,
  DiscordInteractionContextType,
  avatarUrl as getAvatarUrl,
} from "@discordeno/bot";
import { client } from "@index";
import { CreateCommandTypes, type DefaultRunnableOptions, type MaybeNullish, type Member, type User } from "@types";

/**
 * Exports the "UserContextCommand" class to create a new user context command instance.
 */
export abstract class UserContextCommand {
  _data: UserContextCommandOptions;
  type: CreateCommandTypes.User = CreateCommandTypes.User;

  constructor(options: UserContextCommandOptions) {
    const { name } = options;

    this._data = {
      name,
    };
  }

  abstract run(options: UserContextCommandRunOptions): Promise<void>;

  async getAvatarUrl(user?: User): Promise<string> {
    const { applicationId, fetchUser } = client;
    /**
     * Checks whether the user is provided or fallback to the current client user.
     */
    const targetUser = user ?? (await fetchUser(applicationId));
    const { avatar, discriminator, id } = targetUser;
    const avatarUrl = getAvatarUrl(id, discriminator, {
      avatar,
      size: 1024,
    });

    return avatarUrl;
  }

  // biome-ignore lint/style/useNamingConvention: JSON should be capitalized.
  toJSON(): CreateContextApplicationCommand {
    const { name } = this._data;

    return {
      contexts: [DiscordInteractionContextType.Guild],
      integrationTypes: [DiscordApplicationIntegrationType.GuildInstall],
      name,
      nsfw: false,
      type: ApplicationCommandTypes.User,
    };
  }
}

type UserContextCommandOptions = Pick<CreateContextApplicationCommand, "name">;

export type UserContextCommandRunOptions = DefaultRunnableOptions & {
  /**
   * The target member from the user context command, if any.
   */
  targetMember: MaybeNullish<Member>;
  /**
   * The target user from the user context command.
   */
  targetUser: User;
};
