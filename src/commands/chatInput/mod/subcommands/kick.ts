import type { CommandInteraction, Member } from "oceanic.js";
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
  name: "kick",
  permissions: {
    user: "KICK_MEMBERS",
    bot: "KICK_MEMBERS",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    const member = interaction.data.options.getMember("user");
    const reason = trim(
      interaction.data.options.getString("reason") ?? "No reason",
      35,
    );

    if (!member) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.kick.invalid-guild-member",
          locale: language,
        }),
      });
    }

    if (
      member.user.id === interaction.user.id ||
      member.user.id === interaction.guild?.ownerID ||
      member.user.id === client.user.id ||
      compareMemberToMember(
        member,
        interaction.guild?.clientMember as Member,
      ) !== "lower"
    ) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.kick.cannot-moderate-member",
          locale: language,
        }),
      });
    }

    if (
      interaction.user.id !== interaction.guild?.ownerID &&
      compareMemberToMember(member, interaction.member as Member) !== "lower"
    ) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.moderation.kick.user-highest-role",
          locale: language,
        }),
      });
    }

    await client.rest.guilds
      .removeMember(interaction.guild?.id as string, member.user.id, reason)
      .then(() => {
        interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              client.locales.__mf(
                {
                  phrase: "commands.moderation.kick.message",
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
      })
      .catch((error) => {
        handleError(error, interaction, language);
      });
  },
});
