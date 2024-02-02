import { EmbedBuilder } from "@oceanicjs/builders";
import type { Prisma } from "@prisma/client";
import type { CommandInteraction } from "oceanic.js";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { prisma } from "../../../../util/db";

export default new SubCommand({
  name: "language",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (client: Fancycord, interaction: CommandInteraction) => {
    const locale = interaction.data.options.getString("language", true);
    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: interaction.guild?.id,
      },
    });
    let newData: Prisma.GuildConfigurationCreateInput;

    if (guildConfiguration) {
      newData = await prisma.guildConfiguration.update({
        where: {
          guild_id: interaction.guild?.id,
        },
        data: {
          language: locale,
        },
      });
    } else {
      newData = await prisma.guildConfiguration.create({
        data: {
          guild_id: interaction.guild?.id as string,
          language: locale,
        },
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          client.locales.__({
            phrase: "commands.configuration.language.message",
            locale: newData.language,
          }),
        )
        .setColor(client.config.colors.success)
        .toJSON(true),
    });
  },
});
