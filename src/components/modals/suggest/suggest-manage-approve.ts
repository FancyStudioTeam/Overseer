import {
  ButtonStyles,
  MessageFlags,
  type ModalSubmitInteraction,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../builders/ActionRow";
import { ButtonBuilder } from "../../../builders/Button";
import { EmbedBuilder } from "../../../builders/Embed";
import { Modal } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import {
  bitFieldValues,
  errorMessage,
  fetchUser,
  sleep,
} from "../../../util/util";

export default new Modal({
  name: "suggest-manage-approve",
  run: async (
    client: Fancycord,
    interaction: ModalSubmitInteraction,
    { language },
  ) => {
    await interaction.deferUpdate().catch(() => null);

    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    const userSuggestion = await prisma.userSuggestion.findUnique({
      where: {
        guild_id: interaction.guild.id,
        message_id: interaction.message?.messageReference?.messageID,
      },
    });

    if (!userSuggestion) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.utility.suggest.suggestion-not-found",
          locale: language,
        }),
      });
    }

    const reason = interaction.data.components.getTextInput(
      "suggest-manage-approve-reason",
      true,
    );
    const message = await client.rest.channels
      .getMessage(interaction.channelID, userSuggestion.message_id)
      .catch(() => null);

    if (message) {
      const flags = bitFieldValues(message.flags);

      if (!flags.some((f) => f === MessageFlags.SUPPRESS_EMBEDS)) {
        message.components.forEach((r, _) => {
          r.components.forEach((c, _) => {
            c.disabled = true;
          });
        });

        await client.rest.channels
          .editMessage(message.channelID, message.id, {
            embeds: new EmbedBuilder()
              .load(message.embeds[0])
              .addField({
                name: client.locales.__mf(
                  {
                    phrase: "commands.utility.suggest.message.field2",
                    locale: language,
                  },
                  {
                    user: interaction.user.username,
                  },
                ),
                value: `<:_:1201948012830531644> ${reason}`,
              })
              .setColor(client.config.colors.SUCCESS)
              .toJSONArray(),
            components: message.components,
          })
          .catch(() => null);
      }

      if (
        flags.some((f) => f === MessageFlags.HAS_THREAD) &&
        message.thread?.ownerID === client.user.id &&
        message.thread
          .permissionsOf(interaction.guild.clientMember)
          .has("MANAGE_CHANNELS")
      ) {
        await sleep(1500);
        await client.rest.channels
          .edit(message.thread.id, {
            name: `[Approved] ${message.thread.name}`,
            locked: true,
            autoArchiveDuration: 60,
          })
          .catch(() => null);
      }

      const user = await fetchUser(userSuggestion.user_id);

      if (user) {
        await sleep(1500);
        await client.rest.users
          .createDM(user.id)
          .then(async (newChannel) => {
            await client.rest.channels
              .createMessage(newChannel.id, {
                embeds: new EmbedBuilder()
                  .setDescription(
                    client.locales.__mf(
                      {
                        phrase:
                          "commands.utility.suggest.row.manage.row.approve.message",
                        locale: language,
                      },
                      {
                        moderator: interaction.user.mention,
                      },
                    ),
                  )
                  .setColor(client.config.colors.COLOR)
                  .toJSONArray(),
                components: new ActionRowBuilder()
                  .addComponents([
                    new ButtonBuilder()
                      .setLabel(
                        client.locales.__({
                          phrase:
                            "commands.utility.suggest.row.manage.row.message.label",
                          locale: language,
                        }),
                      )
                      .setStyle(ButtonStyles.LINK)
                      .setEmoji({
                        name: "_",
                        id: "1201589945853296780",
                      })
                      .setURL(message.jumpLink),
                  ])
                  .toJSONArray(),
              })
              .catch(() => null);
          })
          .catch(() => null);
      }
    }

    await prisma.userSuggestion.delete({
      where: {
        guild_id: userSuggestion.guild_id,
        message_id: userSuggestion.message_id,
      },
    });
  },
});
