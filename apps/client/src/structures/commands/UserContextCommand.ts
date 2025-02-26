import {
  ApplicationCommandTypes,
  type CreateContextApplicationCommand,
  DiscordApplicationIntegrationType,
  DiscordInteractionContextType,
  avatarUrl as getAvatarUrl,
} from "@discordeno/bot";
import { client } from "@util/client.js";
import {
  CreateCommandTypes,
  type DefaultRunnableOptions,
  type MaybeOptional,
  type Member,
  type User,
} from "@util/types.js";

export abstract class UserContextCommand {
  _registerOptions: Partial<UserContextCommandOptions> = {};
  type: CreateCommandTypes.User = CreateCommandTypes.User;

  abstract run(options: UserContextCommandRunOptions): Promise<void>;

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

  toJSON(): CreateContextApplicationCommand {
    const { name } = this._registerOptions;

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
