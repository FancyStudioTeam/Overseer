import {
  type BaseCollectorEndReasons,
  InteractionCollector,
  type InteractionCollectorEndReasons,
} from "oceanic-collectors";
import {
  type AnyInteractionGateway,
  type ButtonComponent,
  ButtonStyles,
  ChannelTypes,
  type ComponentInteraction,
  ComponentTypes,
  type CreateMessageOptions,
  type EmbedOptions,
  type InteractionContent,
  InteractionTypes,
  type Message,
  MessageFlags,
} from "oceanic.js";
import { match } from "ts-pattern";
import { ActionRowBuilder, ButtonBuilder } from "#builders";
import { Emojis } from "#constants";
import { _client } from "#index";
import { Translations } from "#locales";
import type { Locales } from "#types";
import { disableComponents, errorMessage, parseEmoji } from "#util";

export async function pagination(
  {
    _context,
    locale,
    ephemeral,
  }: {
    _context: AnyInteractionGateway | Message;
    locale: Locales;
    ephemeral?: boolean;
  },
  pages: EmbedOptions[],
): Promise<void> {
  if (!(_context.inCachedGuildChannel() && _context.guild)) return;
  if (!_context.channel) return;
  if (_context.channel.type !== ChannelTypes.GUILD_TEXT) return;

  let index = 0;
  let message: Message;
  const payload: CreateMessageOptions & InteractionContent = {
    embeds: [pages[index]],
    components: new ActionRowBuilder()
      .addComponents([
        new ButtonBuilder()
          .setCustomID("pagination_left")
          .setStyle(ButtonStyles.SECONDARY)
          .setEmoji(parseEmoji(Emojis.LEFT))
          .setDisabled(pages.length < 2),
        new ButtonBuilder()
          .setCustomID("pagination_pages")
          .setStyle(ButtonStyles.SECONDARY)
          .setLabel(`${index + 1}/${pages.length}`)
          .setEmoji(parseEmoji(Emojis.BROWSE))
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomID("pagination_right")
          .setStyle(ButtonStyles.SECONDARY)
          .setEmoji(parseEmoji(Emojis.RIGHT))
          .setDisabled(pages.length < 2),
      ])
      .toJSONArray(),
    flags: ephemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  if ("reply" in _context) {
    const _originalMessageResponse = await _context.reply(payload);
    message = _originalMessageResponse.hasMessage()
      ? _originalMessageResponse.message
      : await _originalMessageResponse.getMessage();
  } else {
    message = await _client.rest.channels.createMessage(
      _context.channelID,
      payload,
    );
  }

  const interactionCollector = new InteractionCollector(_client, {
    message,
    channel: _context.channel,
    guild: _context.guild,
    interactionType: InteractionTypes.MESSAGE_COMPONENT,
    componentType: ComponentTypes.BUTTON,
    idle: 30_000,
    filter: async (_collectedInteraction: ComponentInteraction) => {
      if (
        ("user" in _context &&
          _collectedInteraction.user.id !== _context.user.id) ||
        ("author" in _context &&
          _collectedInteraction.user.id !== _context.author.id)
      ) {
        await errorMessage(
          {
            _context: _collectedInteraction,
            ephemeral: true,
          },
          {
            description: Translations[locale].GLOBAL.INVALID_USER_COLLECTOR,
          },
        );

        return false;
      }

      return true;
    },
  });

  interactionCollector.on(
    "collect",
    async (_collectedInteraction: AnyInteractionGateway) => {
      if (_collectedInteraction.isComponentInteraction()) {
        if (_collectedInteraction.isButtonComponentInteraction()) {
          await _collectedInteraction.deferUpdate().catch(() => null);

          match(_collectedInteraction.data.customID)
            .with("pagination_left", () => {
              index = index > 0 ? --index : pages.length - 1;
            })
            .with("pagination_right", () => {
              index = index + 1 < pages.length ? ++index : 0;
            })
            .otherwise(() => null);

          new ButtonBuilder()
            .load(<ButtonComponent>message.components[0].components[1])
            .setLabel(`${index + 1}/${pages.length}`);

          await _client.rest.channels.editMessage(
            message.channelID,
            message.id,
            {
              embeds: [pages[index]],
              components: message.components,
            },
          );
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
}
