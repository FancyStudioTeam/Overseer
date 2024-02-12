import humanize from "humanize-duration";
import ms from "ms";
import {
  ChannelTypes,
  type CommandInteraction,
  type TextChannel,
} from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { errorMessage, handleError } from "../../../../util/util";

export default new SubCommand({
  name: "slowmode",
  permissions: {
    user: "MANAGE_CHANNELS",
    bot: "MANAGE_CHANNELS",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    const duration = interaction.data.options.getString("duration", true);
    const channel =
      interaction.data.options.getChannel("channel") ?? interaction.channel;

    if (channel?.type !== ChannelTypes.GUILD_TEXT) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.slowmode.invalid-channel-type",
          locale: language,
        }),
      });
    }

    const parsedTime = ms(duration);

    if (parsedTime === undefined) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.slowmode.invalid-duration-time",
          locale: language,
        }),
      });
    }

    if (parsedTime < ms("0 seconds") || parsedTime > ms("6 hours")) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.slowmode.allowed-duration-values",
          locale: language,
        }),
      });
    }

    await client.rest.channels
      .edit(channel.id, {
        rateLimitPerUser: parsedTime / 1000,
      })
      .then((newChannel) => {
        interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              client.locales.__mf(
                {
                  phrase: "commands.moderation.slowmode.message",
                  locale: language,
                },
                {
                  moderator: interaction.user.mention,
                  slowmode: humanize(
                    (newChannel as TextChannel).rateLimitPerUser * 1000,
                    {
                      language: language,
                      largest: 2,
                    },
                  ),
                  channel: newChannel.mention,
                },
              ),
            )
            .setColor(client.config.colors.success)
            .toJSONArray(),
        });
      })
      .catch((error) => {
        handleError(error, interaction, language);
      });
  },
});
