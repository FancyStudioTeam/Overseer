import { createMessage } from "@functions/createMessage.js";
import { UserContextCommand, type UserContextCommandRunOptions } from "@structures/commands/UserContextCommand.js";
import { Declare } from "@util/decorators.js";

@Declare({
  name: "Avatar",
})
export default class AvatarCommand extends UserContextCommand {
  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async _run(options: UserContextCommandRunOptions): Promise<unknown> {
    const { context, targetUser } = options;
    const avatarUrl = await this.getAvatarUrl(targetUser);

    return await createMessage(
      context,
      {
        image: {
          url: avatarUrl,
        },
      },
      {
        isEphemeral: false,
      },
    );
  }
}
