import {
  type BaseCollectorEndReasons,
  InteractionCollector,
  type InteractionCollectorEndReasons,
} from "oceanic-collectors";
import {
  type AnyInteractionChannel,
  type AnyInteractionGateway,
  type ApplicationCommandTypes,
  ButtonStyles,
  type CommandInteraction,
  type ComponentInteraction,
  ComponentTypes,
  InteractionTypes,
  type Uncached,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../../builders/ActionRow";
import { ButtonBuilder } from "../../../../builders/Button";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Colors, Emojis } from "../../../../constants";
import { Translations } from "../../../../locales";
import { prisma } from "../../../../util/db";
import {
  disableComponents,
  errorMessage,
  handleError,
  parseEmoji,
} from "../../../../util/util";

export default new SubCommand({
  name: "premium_revoke",
  permissions: {
    user: "ADMINISTRATOR",
  },
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.CHAT_INPUT
    >,
    { locale },
  ) => {
    if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) {
      return await errorMessage(_interaction, true, {
        description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: _interaction,
        }),
      });
    }

    if (_interaction.user.id !== _interaction.guild.ownerID) {
      return await errorMessage(_interaction, true, {
        description: Translations[locale].GENERAL.ONLY_GUILD_OWNER,
      });
    }

    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: _interaction.guild.id,
      },
    });

    if (!guildConfiguration?.premium) {
      return await errorMessage(_interaction, true, {
        description:
          Translations[locale].COMMANDS.CONFIG.PREMIUM.REVOKE
            .INVALID_GUILD_MEMBERSHIP,
      });
    }

    const _originalMessageResponse = await _interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.CONFIG.PREMIUM.REVOKE.MESSAGE_1,
        )
        .setColor(Colors.WARNING)
        .toJSONArray(),
      components: new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
            .setCustomID("premium_revoke_confirm")
            .setLabel(
              Translations[locale].COMMANDS.CONFIG.PREMIUM.REVOKE.COMPONENTS
                .BUTTONS.CONFIRM.LABEL,
            )
            .setStyle(ButtonStyles.DANGER)
            .setEmoji(parseEmoji(Emojis.CHECK)),
          new ButtonBuilder()
            .setCustomID("premium_revoke_cancel")
            .setLabel(
              Translations[locale].COMMANDS.CONFIG.PREMIUM.REVOKE.COMPONENTS
                .BUTTONS.CANCEL.LABEL,
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji(parseEmoji(Emojis.CANCEL)),
        ])
        .toJSONArray(),
    });
    const message = _originalMessageResponse.hasMessage()
      ? _originalMessageResponse.message
      : await _originalMessageResponse.getMessage();
    const interactionCollector = new InteractionCollector(_client, {
      message,
      channel: _interaction.channel,
      interaction: _interaction,
      guild: _interaction.guild,
      interactionType: InteractionTypes.MESSAGE_COMPONENT,
      componentType: ComponentTypes.BUTTON,
      time: 15_000,
      filter: async (
        _collectedInteraction: ComponentInteraction<ComponentTypes.BUTTON>,
      ) => {
        if (_collectedInteraction.user.id !== _interaction.user.id) {
          await errorMessage(_collectedInteraction, true, {
            description: Translations[locale].GENERAL.INVALID_USER_COLLECTOR,
          });

          return false;
        }

        return true;
      },
    });

    interactionCollector.on(
      "collect",
      async (_collectedInteraction: AnyInteractionGateway) => {
        if (_collectedInteraction.isComponentInteraction()) {
          if (
            !(
              _collectedInteraction.inCachedGuildChannel() &&
              _collectedInteraction.guild
            )
          ) {
            return await errorMessage(_collectedInteraction, true, {
              description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
                structure: _collectedInteraction,
              }),
            });
          }

          if (_collectedInteraction.isButtonComponentInteraction()) {
            await _collectedInteraction.deferUpdate().catch(() => null);

            switch (_collectedInteraction.data.customID) {
              case "premium_revoke_confirm": {
                interactionCollector.stop();

                await prisma.guildConfiguration
                  .update({
                    where: {
                      guild_id: _collectedInteraction.guild.id,
                    },
                    data: {
                      premium: false,
                      expires_at: 0,
                    },
                  })
                  .then(async () => {
                    await _client.rest.channels
                      .editMessage(message.channelID, message.id, {
                        embeds: new EmbedBuilder()
                          .setDescription(
                            Translations[locale].COMMANDS.CONFIG.PREMIUM.REVOKE
                              .COMPONENTS.BUTTONS.CONFIRM.MESSAGE_1,
                          )
                          .setColor(Colors.SUCCESS)
                          .toJSONArray(),
                        components: [],
                      })
                      .catch(() => null);
                  })
                  .catch(async (error) => {
                    await handleError(
                      {
                        _context: _interaction,
                        locale,
                      },
                      error,
                    );
                  });

                break;
              }
              case "premium_revoke_cancel": {
                interactionCollector.stop();

                await _client.rest.channels
                  .editMessage(message.channelID, message.id, {
                    embeds: new EmbedBuilder()
                      .setDescription(
                        Translations[locale].COMMANDS.CONFIG.PREMIUM.REVOKE
                          .COMPONENTS.BUTTONS.CANCEL.MESSAGE_1,
                      )
                      .setColor(Colors.SUCCESS)
                      .toJSONArray(),
                    components: [],
                  })
                  .catch(() => null);

                break;
              }
            }
          }
        }
      },
    );

    interactionCollector.once(
      "end",
      async (
        _,
        _endReason: BaseCollectorEndReasons & InteractionCollectorEndReasons,
      ) => {
        if (
          [
            "user",
            "guildDelete",
            "channelDelete",
            "threadDelete",
            "messageDelete",
          ].includes(_endReason)
        )
          return;

        await disableComponents(message);
      },
    );
  },
});
