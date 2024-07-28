import { ActionRow, Button } from "oceanic-builders";
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
import { Emojis } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import type { Locales } from "#types";
import { disableMessageComponents, errorMessage, parseEmoji } from "#util/Util.js";

export async function pagination({
  context,
  embeds,
  locale,
  shouldBeEphemeral = false,
  timeBeforeExpiration = 30_000,
}: {
  context: AnyInteractionGateway | Message;
  embeds: EmbedOptions[];
  locale: Locales;
  shouldBeEphemeral?: boolean;
  timeBeforeExpiration?: number;
}): Promise<void> {
  if (!(context.inCachedGuildChannel() && context.guild)) return;
  if (!context.channel) return;
  if (context.channel.type !== ChannelTypes.GUILD_TEXT) return;

  let index = 0;
  let replyMessage: Message;
  const messagePayload: CreateMessageOptions & InteractionContent = {
    embeds: [embeds[index]],
    components: new ActionRow()
      .addComponents([
        new Button()
          .setCustomID("pagination_left")
          .setStyle(ButtonStyles.SECONDARY)
          .setEmoji(parseEmoji(Emojis.CIRCLE_CHEVRON_LEFT))
          .setDisabled(embeds.length < 2),
        new Button()
          .setCustomID("pagination_pages")
          .setStyle(ButtonStyles.SECONDARY)
          .setLabel(`${index + 1}/${embeds.length}`)
          .setEmoji(parseEmoji(Emojis.COMPASS))
          .setDisabled(true),
        new Button()
          .setCustomID("pagination_right")
          .setStyle(ButtonStyles.SECONDARY)
          .setEmoji(parseEmoji(Emojis.CIRCLE_CHEVRON_RIGHT))
          .setDisabled(embeds.length < 2),
      ])
      .toJSON(true),
    flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  if ("reply" in context) {
    const replyMessageResponse = await context.reply(messagePayload);
    replyMessage = replyMessageResponse.hasMessage()
      ? replyMessageResponse.message
      : await replyMessageResponse.getMessage();
  } else {
    replyMessage = await client.rest.channels.createMessage(context.channelID, messagePayload);
  }

  const interactionCollector = new InteractionCollector(client, {
    message: replyMessage,
    channel: context.channel,
    interactionType: InteractionTypes.MESSAGE_COMPONENT,
    componentType: ComponentTypes.BUTTON,
    idle: timeBeforeExpiration,
    filter: async (collectedInteraction: ComponentInteraction) => {
      if (
        ("user" in context && collectedInteraction.user.id !== context.user.id) ||
        ("author" in context && collectedInteraction.user.id !== context.author.id)
      ) {
        await errorMessage({
          context: collectedInteraction,
          message: Translations[locale].GLOBAL.INVALID_USER_COLLECTOR,
        });

        return false;
      }

      return true;
    },
  });

  interactionCollector.on("collect", async (collectedInteraction) => {
    if (collectedInteraction.isComponentInteraction()) {
      if (collectedInteraction.isButtonComponentInteraction()) {
        await collectedInteraction.deferUpdate().catch(() => undefined);

        match(collectedInteraction.data.customID)
          .returnType<void>()
          .with("pagination_left", () => (index = index > 0 ? --index : embeds.length - 1))
          .with("pagination_right", () => (index = index + 1 < embeds.length ? ++index : 0))
          .otherwise(() => undefined);

        const row = replyMessage.components[0].components;
        row[1] = new Button(<ButtonComponent>row[1]).setLabel(`${index + 1}/${embeds.length}`).toJSON();

        await client.rest.channels.editMessage(replyMessage.channelID, replyMessage.id, {
          embeds: [embeds[index]],
          components: replyMessage.components,
        });
      }
    }
  });

  interactionCollector.once("end", async (_, _endReason: BaseCollectorEndReasons & InteractionCollectorEndReasons) => {
    if (["user", "guildDelete", "channelDelete", "threadDelete", "messageDelete"].includes(_endReason)) return;

    await disableMessageComponents(replyMessage);
  });
}
