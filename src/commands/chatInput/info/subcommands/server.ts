import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { fetchUser, formatDate, formatString } from "../../../../util/util";

export default new SubCommand({
  name: "server",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language, timezone, hour12 },
  ) => {
    const owner = await fetchUser(interaction.guild?.ownerID as string);

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: interaction.guild?.name as string,
          iconURL: interaction.guild?.iconURL() ?? client.user.avatarURL(),
        })
        .setThumbnail(interaction.guild?.iconURL() ?? client.user.avatarURL())
        .addFields([
          {
            name: client.locales.__({
              phrase: "commands.information.server.message.field",
              locale: language,
            }),
            value: `\`\`\`ansi\n${formatString(
              client.locales.__mf(
                {
                  phrase: "commands.information.server.message.value",
                  locale: language,
                },
                {
                  name: interaction.guild?.name,
                  id: interaction.guild?.id,
                  owner: owner?.username ?? "Unknown User",
                  ownerId: interaction.guild?.ownerID ?? "❌",
                  createdAt: formatDate(
                    timezone,
                    interaction.guild?.createdAt as Date,
                    hour12,
                  ),
                },
              ),
              "∷",
            )}\x1b[0m\`\`\``,
          },
          {
            name: client.locales.__({
              phrase: "commands.information.server.message.field2",
              locale: language,
            }),
            value: `\`\`\`ansi\n${formatString(
              client.locales.__mf(
                {
                  phrase: "commands.information.server.message.value2",
                  locale: language,
                },
                {
                  members: interaction.guild?.memberCount,
                  channels: interaction.guild?.channels.size,
                  roles: interaction.guild?.roles.size,
                  emojis: interaction.guild?.emojis.size,
                },
              ),
              "∷",
            )}\x1b[0m\`\`\``,
          },
        ])
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });
  },
});
