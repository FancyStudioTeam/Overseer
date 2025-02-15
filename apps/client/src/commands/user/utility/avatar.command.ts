import { ApplicationCommandTypes } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { UserContextCommand, type UserContextCommandRunOptions } from "@structures/commands/UserContextCommand.js";
import { Declare } from "@util/decorators.js";

@Declare({
  name: "Avatar",
  type: ApplicationCommandTypes.User,
})
export default class AvatarCommand extends UserContextCommand {
  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async run(options: UserContextCommandRunOptions): Promise<void> {
    const { context, targetUser } = options;
    const avatarUrl = await this.getAvatarUrl(targetUser);

    await createMessage(context, {
      image: {
        url: avatarUrl,
      },
    });
  }
}
