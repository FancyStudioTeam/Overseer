import { Emojis } from "@constants";
import { client } from "@index";
import { Translations } from "@translations";
import type { Locales } from "@types";
import { createErrorMessage, createMessage, disableMessageComponents, noop, parseEmoji } from "@utils";
import { ActionRow, Button } from "oceanic-builders";
import { InteractionCollector } from "oceanic-collectors";
import {
  type AnyInteractionGateway,
  type ButtonComponent,
  ButtonStyles,
  ChannelTypes,
  ComponentTypes,
  type EmbedOptions,
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
    data: (
      | {
          components: MessageComponent[];
          embed: EmbedOptions;
        }
      | EmbedOptions
    )[];
    locale: Locales;
    shouldBeEphemeral?: boolean;
    timeBeforeExpiration?: number;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;
  if (!context.channel) return;
  if (context.channel.type !== ChannelTypes.GUILD_TEXT) return;

  let paginationIndex = 0;
  const paginationEmbeds = data.map((element) => ("embed" in element ? element.embed : element));
  const paginationComponents = data.map((element) => ("components" in element ? element.components : []));
  const paginationElements = (index: number) => {
    const components = [
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
    ];

    if (paginationComponents[index].length > 0) {
      components.push(new ActionRow().addComponents(paginationComponents[index]).toJSON());
    }

    return {
      components,
      embed: paginationEmbeds[index],
    };
  };
  const originalMessage = await createMessage(context, {
    components: paginationElements(paginationIndex).components,
    embeds: [paginationElements(paginationIndex).embed],
    flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
  });

  const interactionCollector = new InteractionCollector(client, {
    channel: context.channel,
    componentType: ComponentTypes.BUTTON,
    idle: timeBeforeExpiration,
    interactionType: InteractionTypes.MESSAGE_COMPONENT,
    message: originalMessage,
    filter: async (collectedInteraction) => {
      if (
        ("user" in context && collectedInteraction.user.id !== context.user.id) ||
        ("author" in context && collectedInteraction.user.id !== context.author.id)
      ) {
        await createErrorMessage(collectedInteraction, Translations[locale].GLOBAL.INVALID_USER_COLLECTOR);

        return false;
      }

      return true;
    },
  });

  interactionCollector.on("collect", async (collectedInteraction) => {
    if (collectedInteraction.isComponentInteraction() && collectedInteraction.isButtonComponentInteraction()) {
      if (!["@pagination/left", "@pagination/right"].includes(collectedInteraction.data.customID)) return;

      await collectedInteraction.deferUpdate().catch(noop);

      match(collectedInteraction.data.customID)
        .with(
          "@pagination/left",
          () => (paginationIndex = paginationIndex > 0 ? --paginationIndex : paginationEmbeds.length - 1),
        )
        .with(
          "@pagination/right",
          () => (paginationIndex = paginationIndex + 1 < paginationEmbeds.length ? ++paginationIndex : 0),
        )
        .otherwise(noop);

      const row = originalMessage.components[0].components;
      let indexButton = row[1] as ButtonComponent;

      indexButton = new Button(indexButton).setLabel(`${paginationIndex + 1}/${paginationEmbeds.length}`).toJSON();

      await client.rest.channels.editMessage(originalMessage.channelID, originalMessage.id, {
        components: paginationElements(paginationIndex).components,
        embeds: [paginationElements(paginationIndex).embed],
      });
    }
  });

  interactionCollector.once("end", async (_, endReason) => {
    if (["user", "guildDelete", "channelDelete", "threadDelete", "messageDelete"].includes(endReason)) return;

    await disableMessageComponents(originalMessage);
  });
};
