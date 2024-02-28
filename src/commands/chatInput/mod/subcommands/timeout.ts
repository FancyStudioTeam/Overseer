import humanize from "humanize-duration";
import ms from "ms";
import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import {
  compareMemberToMember,
  errorMessage,
  handleError,
  trim,
} from "../../../../util/util";

export default new SubCommand({
  name: "timeout",
  permissions: {
    user: "MODERATE_MEMBERS",
    bot: "MODERATE_MEMBERS",
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
    const duration = interaction.data.options.getString("duration", true);
    const reason = trim(
      interaction.data.options.getString("reason") ?? "No reason",
      35
    );

    if (!member) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.timeout.invalid-guild-member",
          locale: language,
        }),
      });
    }

    if (
      member.user.id === interaction.user.id ||
      member.user.id === interaction.guild.ownerID ||
      member.user.id === client.user.id ||
      compareMemberToMember(member, interaction.guild.clientMember) !== "lower"
    ) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.timeout.cannot-moderate-member",
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
          phrase: "commands.moderation.timeout.user-highest-role",
          locale: language,
        }),
      });
    }

    const parsedTime = ms(duration);

    if (parsedTime === undefined) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.timeout.invalid-duration-time",
          locale: language,
        }),
      });
    }

    if (parsedTime < ms("0 seconds") || parsedTime > ms("28 days")) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.timeout.allowed-duration-values",
          locale: language,
        }),
      });
    }

    await client.rest.guilds
      .editMember(interaction.guild.id, member.user.id, {
        communicationDisabledUntil:
          parsedTime > ms("0 seconds")
            ? new Date(Date.now() + parsedTime).toISOString()
            : null,
        reason: reason,
      })
      .then((newMember) => {
        interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              client.locales.__mf(
                {
                  phrase: newMember.communicationDisabledUntil
                    ? "commands.moderation.timeout.message"
                    : "commands.moderation.timeout.message2",
                  locale: language,
                },
                {
                  moderator: interaction.user.mention,
                  timeout: humanize(parsedTime, {
                    language: language,
                    largest: 2,
                  }),
                  user: member.user.mention,
                }
              )
            )
            .setColor(client.config.colors.SUCCESS)
            .toJSONArray(),
        });
      })
      .catch((error) => {
        handleError(error, interaction, language);
      });
  },
});
