import {
  type ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  avatarUrl as getAvatarUrl,
} from "@discordeno/bot";
import { client } from "@util/client.js";
import type { CommandOptionsData } from "@util/decorators.js";
import type { DefaultRunnableOptions, User } from "@util/types.js";

export abstract class ChatInputSubCommand {
  /** The command options to check and handle when the command is executed. */
  _options: Partial<CommandOptionsData> = {};
  _registerOptions: Partial<ChatInputSubCommandOptions> = {};

  abstract run(options: ChatInputSubCommandRunOptions<unknown>): Promise<void>;

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
  toJSON(): ApplicationCommandOption {
    const { description, descriptionLocalizations, name, options: _options } = this._registerOptions;

    return {
      description: description ?? "",
      descriptionLocalizations,
      name: name ?? "",
      options: _options,
      type: ApplicationCommandOptionTypes.SubCommand,
    };
  }
}
export type ChatInputSubCommandOptions = Pick<
  ApplicationCommandOption,
  "choices" | "description" | "descriptionLocalizations" | "name" | "options"
>;

export type ChatInputSubCommandRunOptions<Options> = DefaultRunnableOptions & {
  /** The parsed sub command options object. */
  options: Options;
};
