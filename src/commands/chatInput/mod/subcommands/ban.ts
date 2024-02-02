import { EmbedBuilder } from "@oceanicjs/builders";
import type { CommandInteraction, Member } from "oceanic.js";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import {
  compareMemberToMember,
  errorMessage,
  handleError,
  trim,
} from "../../../../util/util";

export default new SubCommand({
  name: "ban",
  permissions: {
    user: "BAN_MEMBERS",
    bot: "BAN_MEMBERS",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    const user = interaction.data.options.getUser("user", true);
    const member = interaction.data.options.getMember("user");
    const reason = trim(
      interaction.data.options.getString("reason") ?? "No reason",
      35,
    );

    if (member) {
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
            phrase: "commands.moderation.ban.cannot-moderate-member",
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
            phrase: "commands.moderation.ban.user-highest-role",
            locale: language,
          }),
        });
      }

      await client.rest.guilds
        .createBan(interaction.guild?.id as string, member.user.id, {
          reason: reason,
        })
        .then(() => {
          interaction.reply({
            embeds: new EmbedBuilder()
              .setDescription(
                client.locales.__mf(
                  {
                    phrase: "commands.moderation.ban.message",
                    locale: language,
                  },
                  {
                    user: member.user.mention,
                    moderator: interaction.user.mention,
                  },
                ),
              )
              .setColor(client.config.colors.success)
              .toJSON(true),
          });
        })
        .catch((error) => {
          handleError(error, interaction, language);
        });
    } else {
      if (
        user.id === interaction.user.id ||
        user.id === interaction.guild?.ownerID ||
        user.id === client.user.id
      ) {
        return errorMessage(interaction, true, {
          description: client.locales.__({
            phrase: "commands.moderation.ban.cannot-moderate-member",
            locale: language,
          }),
        });
      }

      await client.rest.guilds
        .createBan(interaction.guild?.id as string, user.id, {
          reason: reason,
        })
        .then(() => {
          interaction.reply({
            embeds: new EmbedBuilder()
              .setDescription(
                client.locales.__mf(
                  {
                    phrase: "commands.moderation.ban.message",
                    locale: language,
                  },
                  {
                    user: user.mention,
                    moderator: interaction.user.mention,
                  },
                ),
              )
              .setColor(client.config.colors.success)
              .toJSON(true),
          });
        })
        .catch((error) => {
          handleError(error, interaction, language);
        });
    }
  },
});
