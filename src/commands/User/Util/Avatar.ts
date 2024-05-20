import {
  ApplicationCommandTypes,
  type CommandInteraction,
  type User,
} from "oceanic.js";
import { Colors } from "../../../Constants";
import { EmbedBuilder } from "../../../builders/Embed";
import { UserCommand } from "../../../classes/Builders";
import type { Discord } from "../../../classes/Client";

export default new UserCommand({
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  run: async (_client: Discord, _interaction: CommandInteraction) => {
    const _userOption = <User>_interaction.data.target;

    await _interaction
      .reply({
        embeds: new EmbedBuilder()
          .setImage(_userOption.avatarURL())
          .setColor(Colors.COLOR)
          .toJSONArray(),
      })
      .catch(() => null);
  },
});
