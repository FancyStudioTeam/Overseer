import { DiscordSnowflake } from "@sapphire/snowflake";
import ms from "ms";
import { ChannelTypes, type CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { errorMessage, handleError } from "../../../../util/util";

export default new SubCommand({
  name: "purge",
  permissions: {
    user: "MANAGE_MESSAGES",
    bot: "MANAGE_MESSAGES",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    const amount = interaction.data.options.getInteger("amount", true);
    const channel =
      interaction.data.options.getChannel("channel") ?? interaction.channel;

    if (channel?.type !== ChannelTypes.GUILD_TEXT) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.purge.invalid-channel-type",
          locale: language,
        }),
      });
    }

    const fetchedMessages = await client.rest.channels
      .getMessages(channel.id, {
        limit: amount + 1,
      })
      .catch(() => null);

    if (!fetchedMessages || !fetchedMessages.length) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.purge.no-recent-messages",
          locale: language,
        }),
      });
    }

    const filteredMessages = fetchedMessages
      .slice(interaction.channel?.id === channel?.id ? 1 : 0)
      .filter(
        (m) => Date.now() - DiscordSnowflake.timestampFrom(m.id) < ms("14d"),
      )
      .map((m) => {
        return m.id;
      });

    if (!filteredMessages.length) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.purge.no-recent-messages",
          locale: language,
        }),
      });
    }

    await client.rest.channels
      .deleteMessages(
        channel.id,
        filteredMessages,
        `[Purge] ${interaction.user.username} executed purge command`,
      )
      .then(async (deletedMessages) => {
        interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              client.locales.__mf(
                {
                  phrase: "commands.moderation.purge.message",
                  locale: language,
                },
                {
                  moderator: interaction.user.mention,
                  messages: deletedMessages,
                  channel: channel.mention,
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
