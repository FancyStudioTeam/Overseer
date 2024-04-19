import {
  ApplicationCommandTypes,
  type CommandInteraction,
  type User,
} from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { UserCommand } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { Colors } from "../../../constants";

export default new UserCommand({
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  run: async (_client: Fancycord, _interaction: CommandInteraction) => {
    const user = <User>_interaction.data.target;

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setImage(user.avatarURL())
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
