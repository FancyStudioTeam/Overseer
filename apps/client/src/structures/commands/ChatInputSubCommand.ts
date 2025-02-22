import {
  type ApplicationCommandOption,
  type ApplicationCommandOptionTypes,
  avatarUrl as getAvatarUrl,
} from "@discordeno/bot";
import { client } from "@util/client.js";
import type { CommandOptionsData } from "@util/decorators.js";
import type { DefaultRunnableOptions, User } from "@util/types.js";

export abstract class ChatInputSubCommand {
  /** The command options to check and handle when the command is executed. */
  _options: Partial<CommandOptionsData> = {};
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
  "description" | "descriptionLocalizations" | "name" | "options"
> & {
  type: ApplicationCommandOptionTypes.SubCommand;
};

export type ChatInputSubCommandRunOptions<Options> = DefaultRunnableOptions & {
  /** The parsed sub command options object. */
  options: Options;
};
