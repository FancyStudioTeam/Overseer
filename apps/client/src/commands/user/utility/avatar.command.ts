import { avatarUrl as getAvatarUrl } from "@discordeno/bot";
import { createMessage } from "@functions/client/createMessage.js";
import { UserContextCommand, type UserContextCommandRunOptions } from "@util/handlers.js";

export default class AvatarCommand extends UserContextCommand {
  constructor() {
    super({
      name: "Avatar",
    });
  }

  async run({ context, targetUser }: UserContextCommandRunOptions): Promise<void> {
    const { avatar, discriminator, id } = targetUser;
    const avatarUrl = getAvatarUrl(id, discriminator, {
      avatar,
      size: 1024,
    });

    await createMessage(context, {
      image: {
        url: avatarUrl,
      },
    });
  }
}
