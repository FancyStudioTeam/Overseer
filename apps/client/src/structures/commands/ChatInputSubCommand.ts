import { type ApplicationCommandOption, avatarUrl as getAvatarUrl } from "@discordeno/bot";
import { client } from "@util/client.js";
import type { CommandOptionsData } from "@util/decorators.js";
import type { DefaultRunnableOptions, User } from "@util/types.js";

export abstract class ChatInputSubCommand {
  /** The command options to manage the command. */
  _commandOptions: Partial<CommandOptionsData> = {};
  _data: ChatInputSubCommandOptions;

  constructor(options: ChatInputSubCommandOptions) {
    const { description, descriptionLocalizations, name, options: _options, type } = options;

    this._data = {
      description,
      descriptionLocalizations,
      name,
      options: _options,
      type,
    };
  }

  abstract run(options: ChatInputSubCommandRunOptions<unknown>): Promise<void>;

  async getAvatarUrl(user?: User): Promise<string> {
    const { applicationId, fetchUser } = client;
    /** Check whether the user is provided or fallback to the current user. */
    const targetUser = user ?? (await fetchUser(applicationId));
    const { avatar, discriminator, id } = targetUser;
    const avatarUrl = getAvatarUrl(id, discriminator, {
      avatar,
      size: 1024,
    });

    return avatarUrl;
  }

  toJSON(): ApplicationCommandOption {
    const { description, descriptionLocalizations, name, options: _options, type } = this._data;

    return {
      description,
      descriptionLocalizations,
      name,
      options: _options,
      type,
    };
  }
}

type ChatInputSubCommandOptions = Pick<
  ApplicationCommandOption,
  "description" | "descriptionLocalizations" | "name" | "options" | "type"
>;

export type ChatInputSubCommandRunOptions<Options> = DefaultRunnableOptions & {
  /** The parsed sub command options object. */
  options: Options;
};
