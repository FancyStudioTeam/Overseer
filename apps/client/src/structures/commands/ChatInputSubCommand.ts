import {
  type ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  avatarUrl as getAvatarUrl,
} from "@discordeno/bot";
import type { ChatInputOptionsResolver } from "@structures/interactions/ChatInputOptionsResolver.js";
import { client } from "@util/client.js";
import type { RunnableInstanceOptions } from "@util/decorators.js";
import type { DefaultRunnableOptions, User } from "@util/types.js";

export abstract class ChatInputSubCommand {
  _declareDecoratorData: Partial<ChatInputSubCommandOptions> = {};
  _instanceOptions: Partial<RunnableInstanceOptions> = {};

  abstract _run(options: ChatInputSubCommandRunOptions<unknown>): Promise<unknown>;

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
    const { description, descriptionLocalizations, name, options: _options } = this._declareDecoratorData;

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
  /** The resolver to manage the application commands options. */
  optionsResolver: ChatInputOptionsResolver;
};
