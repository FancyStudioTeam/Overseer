import { DiscordSnowflake } from "@sapphire/snowflake";
import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { prisma } from "../../../../util/db";
import {
  compareMemberToMember,
  errorMessage,
  trim,
} from "../../../../util/util";

export default new SubCommand({
  name: "warn_add",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
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
    const reason = trim(
      interaction.data.options.getString("reason") ?? "No reason",
      35,
    );

    if (!member) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.warn.add.invalid-guild-member",
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
          phrase: "commands.moderation.warn.add.cannot-moderate-member",
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
          phrase: "commands.moderation.warn.add.user-highest-role",
          locale: language,
        }),
      });
    }

    const userWarn = await prisma.userWarn.findMany({
      where: {
        guild_id: interaction.guild.id,
        user_id: member.user.id,
      },
    });

    if (userWarn.length >= 7) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.warn.add.max-warnings-allowed",
          locale: language,
        }),
      });
    }

    const id = DiscordSnowflake.generate().toString();

    await prisma.userWarn
      .create({
        data: {
          guild_id: interaction.guild.id,
          user_id: member.user.id,
          warn_id: id,
          moderator_id: interaction.user.id,
          reason: reason,
        },
      })
      .then(() => {
        interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              client.locales.__mf(
                {
                  phrase: "commands.moderation.warn.add.message",
                  locale: language,
                },
                {
                  user: member.user.mention,
                  moderator: interaction.user.mention,
                },
              ),
            )
            .setColor(client.config.colors.success)
            .toJSONArray(),
        });
      });
  },
});
