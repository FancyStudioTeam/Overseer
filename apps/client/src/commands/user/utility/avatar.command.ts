import { createMessage } from "@functions/createMessage.js";
import { UserContextCommand, type UserContextCommandRunOptions } from "@structures/commands/UserContextCommand.js";

export default class AvatarCommand extends UserContextCommand {
  constructor() {
    super({
      name: "Avatar",
    });
  }

  async run({ context, targetUser }: UserContextCommandRunOptions): Promise<void> {
    const avatarUrl = await this.getAvatarUrl(targetUser);

    await createMessage(context, {
      image: {
        url: avatarUrl,
      },
    });
  }
}
