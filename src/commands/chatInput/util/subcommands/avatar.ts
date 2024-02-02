import { EmbedBuilder } from "@oceanicjs/builders";
import type { CommandInteraction } from "oceanic.js";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";

export default new SubCommand({
  name: "avatar",
  run: async (client: Fancycord, interaction: CommandInteraction) => {
    const user = interaction.data.options.getUser("user") ?? interaction.user;

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor(user.username, user.avatarURL())
        .setImage(user.avatarURL())
        .setColor(client.config.colors.color)
        .toJSON(true),
    });
  },
});
