import { avatarUrl as getAvatarUrl } from "@discordeno/bot";
import { client } from "@util/client.js";
import type { RunnableInstanceOptions } from "@util/decorators.js";
import type { DefaultRunnableOptions, User } from "@util/types.js";

export abstract class ModalComponent {
  _declareDecoratorData: Partial<ModalComponentOptions> = {};
  _instanceOptions: Partial<RunnableInstanceOptions> = {};

  abstract _run(options: ModalComponentRunOptions): Promise<unknown>;

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

export interface ModalComponentOptions {
  /** The custom id of the component. */
  customId: string;
}

export type ModalComponentRunOptions = DefaultRunnableOptions & {
  /** The values retreived from the component custom id. */
  values: string[];
};
