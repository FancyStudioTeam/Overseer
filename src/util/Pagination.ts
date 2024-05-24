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
import { _client } from "..";
import { Emojis } from "../Constants";
import { ActionRowBuilder } from "../builders/ActionRow";
import { ButtonBuilder } from "../builders/Button";
import { Translations } from "../locales";
import type { Locales } from "../types";
import { disableComponents, errorMessage, parseEmoji } from "./Util";

export async function pagination(
  main: {
    _context: AnyInteractionGateway | Message;
    locale: Locales;
    ephemeral?: boolean;
  },
  pages: EmbedOptions[],
): Promise<void> {
  if (!(main._context.inCachedGuildChannel() && main._context.guild)) return;
  if (!main._context.channel) return;
  if (main._context.channel.type !== ChannelTypes.GUILD_TEXT) return;

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
    flags: main.ephemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  if ("reply" in main._context) {
    const _originalMessageResponse = await main._context.reply(payload);
    message = _originalMessageResponse.hasMessage()
      ? _originalMessageResponse.message
      : await _originalMessageResponse.getMessage();
  } else {
    message = await _client.rest.channels.createMessage(
      main._context.channelID,
      payload,
    );
  }

  const interactionCollector = new InteractionCollector(_client, {
    message,
    channel: main._context.channel,
    guild: main._context.guild,
    interactionType: InteractionTypes.MESSAGE_COMPONENT,
    componentType: ComponentTypes.BUTTON,
    idle: 30_000,
    filter: async (_collectedInteraction: ComponentInteraction) => {
      if (
        ("user" in main._context &&
          _collectedInteraction.user.id !== main._context.user.id) ||
        ("author" in main._context &&
          _collectedInteraction.user.id !== main._context.author.id)
      ) {
        await errorMessage(
          {
            _context: _collectedInteraction,
            ephemeral: true,
          },
          {
            description:
              Translations[main.locale].GENERAL.INVALID_USER_COLLECTOR,
          },
        );

        return false;
      }

      return true;
    },
  });

  interactionCollector.on(
    "collect",
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity:
    async (_collectedInteraction: AnyInteractionGateway) => {
      if (_collectedInteraction.isComponentInteraction()) {
        if (_collectedInteraction.isButtonComponentInteraction()) {
          await _collectedInteraction.deferUpdate().catch(() => null);

          switch (_collectedInteraction.data.customID) {
            case "pagination_left": {
              index = index > 0 ? --index : pages.length - 1;

              break;
            }
            case "pagination_right": {
              index = index + 1 < pages.length ? ++index : 0;

              break;
            }
          }

          new ButtonBuilder()
            .load(<ButtonComponent>message.components[0].components[1])
            .setLabel(`${index + 1}/${pages.length}`);

          await _client.rest.channels
            .editMessage(message.channelID, message.id, {
              embeds: [pages[index]],
              components: message.components,
            })
            .catch(() => null);
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
