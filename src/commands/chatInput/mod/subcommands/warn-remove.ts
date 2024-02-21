import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { prisma } from "../../../../util/db";
import { compareMemberToMember, errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "warn_remove",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language }
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    const member = interaction.data.options.getMember("user");
    const warn = interaction.data.options.getString("warning", true);

    if (!member) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.warn.remove.invalid-guild-member",
          locale: language,
        }),
      });
    }

    if (
      member.user.id === interaction.user.id ||
      member.user.id === interaction.guild.ownerID ||
      member.user.id === client.user.id ||
      member.user.bot
    ) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.warn.remove.cannot-moderate-member",
          locale: language,
        }),
      });
    }

    if (
      interaction.user.id !== interaction.guild.ownerID &&
      compareMemberToMember(member, interaction.member) !== "lower"
    ) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.warn.remove.user-highest-role",
          locale: language,
        }),
      });
    }

    const userWarn = await prisma.userWarn.findUnique({
      where: {
        guild_id: interaction.guild.id,
        user_id: member.user.id,
        warn_id: warn.trim(),
      },
    });

    if (!userWarn) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.warn.remove.warning-not-found",
          locale: language,
        }),
      });
    }

    await prisma.userWarn
      .delete({
        where: {
          guild_id: userWarn.guild_id,
          user_id: userWarn.user_id,
          warn_id: userWarn.warn_id,
        },
      })
      .then(() => {
        interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              client.locales.__mf(
                {
                  phrase: "commands.moderation.warn.remove.message",
                  locale: language,
                },
                {
                  moderator: interaction.user.mention,
                  user: member.user.mention,
                }
              )
            )
            .setColor(client.config.colors.success)
            .toJSONArray(),
        });
      });
  },
});
