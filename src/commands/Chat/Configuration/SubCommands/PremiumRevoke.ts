import {
  type BaseCollectorEndReasons,
  InteractionCollector,
  type InteractionCollectorEndReasons,
} from "oceanic-collectors";
import {
  type AnyInteractionGateway,
  ButtonStyles,
  type CommandInteraction,
  type ComponentInteraction,
  ComponentTypes,
  InteractionTypes,
} from "oceanic.js";
import { match } from "ts-pattern";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "#builders";
import { BaseBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors, Emojis } from "#constants";
import { Translations } from "#locales";
import { prisma } from "#prisma";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { disableComponents, errorMessage, parseEmoji } from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "premium_revoke",
  permissions: {
    user: ["ADMINISTRATOR"],
  },
  directory: Directory.CONFIGURATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage({
        _context,
        ephemeral: true,
        embed: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: _context,
        }),
      });
    }

    if (_context.user.id !== _context.guild.ownerID) {
      return await errorMessage({
        _context,
        ephemeral: true,
        embed: Translations[locale].GLOBAL.ONLY_GUILD_OWNER,
      });
    }

    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: _context.guildID,
      },
    });

    if (!guildConfiguration?.premium) {
      return await errorMessage({
        _context,
        ephemeral: true,
        embed:
          Translations[locale].COMMANDS.CONFIGURATION.PREMIUM.REVOKE
            .INVALID_GUILD_MEMBERSHIP,
      });
    }

    const _originalMessageResponse = await _context.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.CONFIGURATION.PREMIUM.REVOKE.MESSAGE_1,
        )
        .setColor(Colors.WARNING)
        .toJSONArray(),
      components: new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
            .setCustomID("premium_revoke_confirm")
            .setLabel(
              Translations[locale].COMMANDS.CONFIGURATION.PREMIUM.REVOKE
                .COMPONENTS.BUTTONS.CONFIRM.LABEL,
            )
            .setStyle(ButtonStyles.DANGER)
            .setEmoji(parseEmoji(Emojis.CHECK)),
          new ButtonBuilder()
            .setCustomID("premium_revoke_cancel")
            .setLabel(
              Translations[locale].COMMANDS.CONFIGURATION.PREMIUM.REVOKE
                .COMPONENTS.BUTTONS.CANCEL.LABEL,
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
      channel: _context.channel,
      interaction: _context,
      guild: _context.guild,
      interactionType: InteractionTypes.MESSAGE_COMPONENT,
      componentType: ComponentTypes.BUTTON,
      time: 15_000,
      filter: async (_collectedInteraction: ComponentInteraction) => {
        if (_collectedInteraction.user.id !== _context.user.id) {
          await errorMessage({
            _context,
            ephemeral: true,
            embed: Translations[locale].GLOBAL.INVALID_USER_COLLECTOR,
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
            return await errorMessage({
              _context,
              ephemeral: true,
              embed: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
                structure: _collectedInteraction,
              }),
            });
          }

          if (_collectedInteraction.isButtonComponentInteraction()) {
            await _collectedInteraction.deferUpdate().catch(() => null);

            match(_collectedInteraction.data.customID)
              .returnType<void>()
              .with("premium_revoke_confirm", async () => {
                interactionCollector.stop();

                await prisma.guildConfiguration.update({
                  where: {
                    guild_id: _collectedInteraction.guildID,
                  },
                  data: {
                    premium: {
                      enabled: false,
                      expires_at: 0,
                    },
                  },
                });

                await _client.rest.channels.editMessage(
                  message.channelID,
                  message.id,
                  {
                    embeds: new EmbedBuilder()
                      .setDescription(
                        Translations[locale].COMMANDS.CONFIGURATION.PREMIUM
                          .REVOKE.COMPONENTS.BUTTONS.CONFIRM.MESSAGE_1,
                      )
                      .setColor(Colors.SUCCESS)
                      .toJSONArray(),
                    components: [],
                  },
                );
              })
              .with("premium_revoke_cancel", async () => {
                interactionCollector.stop();

                await _client.rest.channels.editMessage(
                  message.channelID,
                  message.id,
                  {
                    embeds: new EmbedBuilder()
                      .setDescription(
                        Translations[locale].COMMANDS.CONFIGURATION.PREMIUM
                          .REVOKE.COMPONENTS.BUTTONS.CANCEL.MESSAGE_1,
                      )
                      .setColor(Colors.SUCCESS)
                      .toJSONArray(),
                    components: [],
                  },
                );
              })
              .otherwise(() => null);
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
