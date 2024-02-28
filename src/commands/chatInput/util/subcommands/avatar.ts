import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";

export default new SubCommand({
  name: "avatar",
  run: async (client: Fancycord, interaction: CommandInteraction) => {
    const user = interaction.data.options.getUser("user") ?? interaction.user;

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: user.username,
          iconURL: user.avatarURL(),
        })
        .setImage(user.avatarURL())
        .setColor(client.config.colors.COLOR)
        .toJSONArray(),
    });
  },
});
