import { EmbedBuilder } from "@oceanicjs/builders";
import type { CommandInteraction } from "oceanic.js";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { prisma } from "../../../../util/db";
import {
  errorMessage,
  formatDate,
  formatString,
  trim,
} from "../../../../util/util";

export default new SubCommand({
  name: "warn_list",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language, timezone, hour12 },
  ) => {
    const member =
      interaction.data.options.getMember("user") || interaction.member;

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
        .setAuthor(member.user.username, member.user.avatarURL())
        .setThumbnail(member.user.avatarURL())
        .addFields(
          userWarn.map((w) => {
            return {
              name: `**ID: ${w.warn_id}**`,
              value: `\`\`\`ansi\n${formatString(
                client.locales.__mf(
                  {
                    phrase: "commands.moderation.warn.list.message.value",
                    locale: language,
                  },
                  {
                    moderator:
                      interaction.guild?.members.get(w.moderator_id)
                        ?.username ?? "Unknown User",
                    reason: trim(w.reason, 35),
                    date: formatDate(timezone, w.date, hour12),
                  },
                ),
                "∷",
              )}\`\`\``,
            };
          }),
        )
        .setColor(client.config.colors.color)
        .toJSON(true),
    });
  },
});
