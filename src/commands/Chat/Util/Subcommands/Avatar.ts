import type { CommandInteraction } from "oceanic.js";
import { Colors } from "../../../../Constants";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";

export default new SubCommand({
  name: "avatar",
  run: async (_client: Discord, _interaction: CommandInteraction) => {
    const _userOption =
      _interaction.data.options.getUser("user") ?? _interaction.user;

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setImage(_userOption.avatarURL())
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
