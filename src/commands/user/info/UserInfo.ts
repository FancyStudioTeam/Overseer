import { EmbedBuilder } from "@oceanicjs/builders";
import { ApplicationCommandTypes, type CommandInteraction } from "oceanic.js";
import { UserCommand } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import {
  errorMessage,
  fetchMember,
  formatDate,
  formatString,
} from "../../../util/util";

export default new UserCommand({
  name: "User Info",
  type: ApplicationCommandTypes.USER,
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language, timezone, hour12 },
  ) => {
    const member = await fetchMember(
      interaction,
      interaction.data.targetID as string,
    );

    if (!member) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.information.info.invalid-guild-member",
          locale: language,
        }),
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor(member.user.username, member.user.avatarURL())
        .setThumbnail(member.user.avatarURL())
        .addFields([
          {
            name: client.locales.__({
              phrase: "commands.information.user.message.field",
              locale: language,
            }),
            value: `\`\`\`ansi\n${formatString(
              client.locales.__mf(
                {
                  phrase: "commands.information.user.message.value",
                  locale: language,
                },
                {
                  user: member.user.username,
                  id: member.user.id,
                  createdAt: formatDate(
                    timezone,
                    member.user.createdAt,
                    hour12,
                  ),
                  joinedAt: formatDate(
                    timezone,
                    member.joinedAt as Date,
                    hour12,
                  ),
                  booster:
                    (member.premiumSince &&
                      formatDate(timezone, member.premiumSince, hour12)) ??
                    "❌",
                },
              ),
              "∷",
            )}\`\`\``,
          },
        ])
        .setColor(client.config.colors.color)
        .toJSON(true),
    });
  },
});
