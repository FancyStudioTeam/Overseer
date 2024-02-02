import { EmbedBuilder } from "@oceanicjs/builders";
import {
  ApplicationCommandTypes,
  type CommandInteraction,
  type User,
} from "oceanic.js";
import { UserCommand } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";

export default new UserCommand({
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  run: async (client: Fancycord, interaction: CommandInteraction) => {
    const user = interaction.data.target as User;

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor(user.username, user.avatarURL())
        .setImage(user.avatarURL())
        .setColor(client.config.colors.color)
        .toJSON(true),
    });
  },
});
