import { Emojis } from "@constants";
import { client } from "@index";
import { Translations } from "@translations";
import type { Locales } from "@types";
import { createErrorMessage, disableMessageComponents, parseEmoji } from "@utils";
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

export const pagination = async (
  context: AnyInteractionGateway | Message,
  {
    data,
    locale,
    shouldBeEphemeral = false,
    timeBeforeExpiration = 30_000,
  }: {
    data: EmbedOptions[];
    locale: Locales;
    shouldBeEphemeral?: boolean;
    timeBeforeExpiration?: number;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;
  if (!context.channel) return;
  if (context.channel.type !== ChannelTypes.GUILD_TEXT) return;

  let index = 0;
  let replyMessage: Message;
  const messagePayload: CreateMessageOptions & InteractionContent = {
    components: new ActionRow()
      .addComponents([
        new Button()
          .setCustomID("@pagination/left")
          .setStyle(ButtonStyles.SECONDARY)
          .setEmoji(parseEmoji(Emojis.ARROW_CIRCLE_LEFT))
          .setDisabled(data.length < 2),
        new Button()
          .setCustomID("@pagination/pages")
          .setStyle(ButtonStyles.SECONDARY)
          .setLabel(`${index + 1}/${data.length}`)
          .setEmoji(parseEmoji(Emojis.EXPLORE))
          .setDisabled(true),
        new Button()
          .setCustomID("@pagination/right")
          .setStyle(ButtonStyles.SECONDARY)
          .setEmoji(parseEmoji(Emojis.ARROW_CIRCLE_RIGHT))
          .setDisabled(data.length < 2),
      ])
      .toJSON(true),
    embeds: [data[index]],
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
    channel: context.channel,
    componentType: ComponentTypes.BUTTON,
    filter: async (collectedInteraction: ComponentInteraction) => {
      if (
        ("user" in context && collectedInteraction.user.id !== context.user.id) ||
        ("author" in context && collectedInteraction.user.id !== context.author.id)
      ) {
        await createErrorMessage(collectedInteraction, {
          content: Translations[locale].GLOBAL.INVALID_USER_COLLECTOR,
        });
        return false;
      }

      return true;
    },
    idle: timeBeforeExpiration,
    interactionType: InteractionTypes.MESSAGE_COMPONENT,
    message: replyMessage,
  });

  interactionCollector.on("collect", async (collectedInteraction) => {
    if (collectedInteraction.isComponentInteraction()) {
      if (collectedInteraction.isButtonComponentInteraction()) {
        await collectedInteraction.deferUpdate().catch(() => undefined);

        match(collectedInteraction.data.customID)
          .with("@pagination/left", () => (index = index > 0 ? --index : data.length - 1))
          .with("@pagination/right", () => (index = index + 1 < data.length ? ++index : 0))
          .otherwise(() => undefined);

        const row = replyMessage.components[0].components;
        row[1] = new Button(row[1] as ButtonComponent).setLabel(`${index + 1}/${data.length}`).toJSON();

        await client.rest.channels.editMessage(replyMessage.channelID, replyMessage.id, {
          components: replyMessage.components,
          embeds: [data[index]],
        });
      }
    }
  });

  interactionCollector.once("end", async (_, endReason: BaseCollectorEndReasons & InteractionCollectorEndReasons) => {
    if (["user", "guildDelete", "channelDelete", "threadDelete", "messageDelete"].includes(endReason)) return;

    await disableMessageComponents(replyMessage);
  });
};
