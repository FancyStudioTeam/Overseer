import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { Colors } from "../../../../constants";

export default new SubCommand({
  name: "avatar",
  run: async (_client: Fancycord, interaction: CommandInteraction) => {
    const user = interaction.data.options.getUser("user") ?? interaction.user;

    interaction.reply({
      embeds: new EmbedBuilder()
        .setImage(user.avatarURL())
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
