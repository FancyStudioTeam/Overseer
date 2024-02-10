import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { UnixType } from "../../../../types";
import { prisma } from "../../../../util/db";
import { errorMessage, trim, unix } from "../../../../util/util";

export default new SubCommand({
  name: "warn_list",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    const member =
      interaction.data.options.getMember("user") ?? interaction.member;

    if (!member) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.warn.list.invalid-guild-member",
          locale: language,
        }),
      });
    }

    const userWarn = await prisma.userWarn.findMany({
      where: {
        guild_id: interaction.guild?.id,
        user_id: member.user.id,
      },
      orderBy: [
        {
          date: "desc",
        },
      ],
    });

    if (!userWarn.length) {
      return errorMessage(interaction, true, {
        description: client.locales.__mf(
          {
            phrase: "commands.moderation.warn.list.has-no-warnings",
            locale: language,
          },
          {
            user: member.user.mention,
          },
        ),
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.avatarURL(),
        })
        .setThumbnail(member.user.avatarURL())
        .addFields(
          userWarn.map((w) => {
            return {
              name: `**ID: ${w.warn_id}**`,
              value: client.locales.__mf(
                {
                  phrase: "commands.moderation.warn.list.message.value",
                  locale: language,
                },
                {
                  moderator:
                    interaction.guild?.members.get(w.moderator_id)?.mention ??
                    "Unknown User",
                  reason: trim(w.reason, 35),
                  date: unix(w.date.toISOString(), UnixType.Default),
                },
              ),
            };
          }),
        )
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });
  },
});
