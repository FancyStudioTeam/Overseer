import { ApplicationCommandTypes } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { UserContextCommand, type UserContextCommandRunOptions } from "@structures/commands/UserContextCommand.js";
import { Declare } from "@util/decorators.js";

@Declare({
  name: "Avatar",
  type: ApplicationCommandTypes.User,
})
export default class AvatarCommand extends UserContextCommand {
  async run({ context, targetUser }: UserContextCommandRunOptions): Promise<void> {
    const avatarUrl = await this.getAvatarUrl(targetUser);

    await createMessage(context, {
      image: {
        url: avatarUrl,
      },
    });
  }
}
