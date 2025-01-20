import { type ApplicationCommandOption, avatarUrl as getAvatarUrl } from "@discordeno/bot";
import { discord } from "@index";
import type { DefaultRunnableOptions, User } from "@types";

/**
 * Exports the "ChatInputSubCommand" class to create a new chat input sub command option instance.
 */
export abstract class ChatInputSubCommand {
  _data: ChatInputSubCommandOptions;

  constructor(options: ChatInputSubCommandOptions) {
    const { description, descriptionLocalizations, name, type } = options;

    this._data = {
      description,
      descriptionLocalizations,
      name,
      type,
    };
  }

  abstract run(options: ChatInputSubCommandRunOptions): Promise<void>;

  async getAvatarUrl(user?: User): Promise<string> {
    const { client, fetchUser } = discord;
    const { applicationId } = client;
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

  // biome-ignore lint/style/useNamingConvention: JSON must be capitalized
  toJSON(): ApplicationCommandOption {
    const { description, descriptionLocalizations, name, type } = this._data;

    return {
      description,
      descriptionLocalizations,
      name,
      type,
    };
  }
}

type ChatInputSubCommandOptions = Pick<
  ApplicationCommandOption,
  "description" | "descriptionLocalizations" | "name" | "type"
>;

export type ChatInputSubCommandRunOptions = DefaultRunnableOptions;
