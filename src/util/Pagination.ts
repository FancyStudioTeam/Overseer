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
  ComponentTypes,
  type CreateMessageOptions,
  type EmbedOptions,
  type InteractionContent,
  InteractionTypes,
  type Message,
  type MessageComponent,
  MessageFlags,
} from "oceanic.js";
import { match } from "ts-pattern";

export const pagination = async (
  context: AnyInteractionGateway | Message,
  {
    data,
    locale,
    shouldBeEphemeral = false,
    timeBeforeExpiration = 30000,
  }: {
    data: {
      components: MessageComponent[];
      embed: EmbedOptions;
    }[];
    locale: Locales;
    shouldBeEphemeral?: boolean;
    timeBeforeExpiration?: number;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;
  if (!context.channel) return;
  if (context.channel.type !== ChannelTypes.GUILD_TEXT) return;

  let paginationIndex = 0;
  let replyMessage: Message;
  const paginationEmbeds = data.map((element) => element.embed);
  const paginationComponents = data.map((element) => element.components);
  const paginationElements = (index: number) => ({
    embed: paginationEmbeds[index],
    components: [
      new ActionRow()
        .addComponents([
          new Button()
            .setCustomID("@pagination/left")
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji(parseEmoji(Emojis.ARROW_CIRCLE_LEFT))
            .setDisabled(paginationEmbeds.length <= 1),
          new Button()
            .setCustomID("@pagination/pages")
            .setStyle(ButtonStyles.SECONDARY)
            .setLabel(`${paginationIndex + 1}/${paginationEmbeds.length}`)
            .setEmoji(parseEmoji(Emojis.EXPLORE))
            .setDisabled(true),
          new Button()
            .setCustomID("@pagination/right")
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji(parseEmoji(Emojis.ARROW_CIRCLE_RIGHT))
            .setDisabled(paginationEmbeds.length <= 1),
        ])
        .toJSON(),
      new ActionRow().addComponents(paginationComponents[index]).toJSON(),
    ],
  });
  const messagePayload: CreateMessageOptions & InteractionContent = {
    components: paginationElements(paginationIndex).components,
    embeds: [paginationElements(paginationIndex).embed],
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
    idle: timeBeforeExpiration,
    interactionType: InteractionTypes.MESSAGE_COMPONENT,
    message: replyMessage,
    filter: async (collectedInteraction) => {
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
  });

  interactionCollector.on("collect", async (collectedInteraction) => {
    if (collectedInteraction.isComponentInteraction() && collectedInteraction.isButtonComponentInteraction()) {
      if (!["@pagination/left", "@pagination/right"].includes(collectedInteraction.data.customID)) return;

      await collectedInteraction.deferUpdate().catch(() => undefined);

      match(collectedInteraction.data.customID)
        .with(
          "@pagination/left",
          () => (paginationIndex = paginationIndex > 0 ? --paginationIndex : paginationEmbeds.length - 1),
        )
        .with(
          "@pagination/right",
          () => (paginationIndex = paginationIndex + 1 < paginationEmbeds.length ? ++paginationIndex : 0),
        )
        .otherwise(() => undefined);

      const row = replyMessage.components[0].components;
      let indexButton = row[1] as ButtonComponent;

      indexButton = new Button(indexButton).setLabel(`${paginationIndex + 1}/${paginationEmbeds.length}`).toJSON();

      await client.rest.channels.editMessage(replyMessage.channelID, replyMessage.id, {
        components: paginationElements(paginationIndex).components,
        embeds: [paginationElements(paginationIndex).embed],
      });
    }
  });

  interactionCollector.once("end", async (_, endReason: BaseCollectorEndReasons & InteractionCollectorEndReasons) => {
    if (["user", "guildDelete", "channelDelete", "threadDelete", "messageDelete"].includes(endReason)) return;

    await disableMessageComponents(replyMessage);
  });
};
