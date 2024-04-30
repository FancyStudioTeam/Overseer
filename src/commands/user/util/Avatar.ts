import {
  type AnyInteractionChannel,
  ApplicationCommandTypes,
  type CommandInteraction,
  type Uncached,
} from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { UserCommand } from "../../../classes/Builders";
import type { Discord } from "../../../classes/Client";
import { Colors } from "../../../constants";

export default new UserCommand({
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.USER
    >
  ) => {
    const user = _interaction.data.target;

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setImage(user.avatarURL())
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
