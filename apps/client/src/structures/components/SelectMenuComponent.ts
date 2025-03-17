import { avatarUrl as getAvatarUrl } from "@discordeno/bot";
import type { SelectMenuOptionsResolver } from "@structures/interactions/SelectMenuOptionsResolver.js";
import { client } from "@util/client.js";
import type { RunnableInstanceOptions } from "@util/decorators.js";
import type { DefaultRunnableOptions, User } from "@util/types.js";

export abstract class SelectMenuComponent {
  _declareDecoratorData: Partial<SelectMenuComponentOptions> = {};
  _instanceOptions: Partial<RunnableInstanceOptions> = {};

  abstract _run(options: SelectMenuComponentRunOptions): Promise<unknown>;

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
}

export interface SelectMenuComponentOptions {
  /** The custom id of the component. */
  customId: string;
}

export type SelectMenuComponentRunOptions = DefaultRunnableOptions & {
  /** The resolver to manage the options. */
  optionsResolver: SelectMenuOptionsResolver;
  /** The values retreived from the component custom id. */
  values: string[];
};
