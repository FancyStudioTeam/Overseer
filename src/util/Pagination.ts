import { Emojis } from "@constants";
import { client } from "@index";
import { Translations } from "@translations";
import type { Locales } from "@types";
import { createErrorMessage, createMessage, disableMessageComponents, noop, parseEmoji } from "@utils";
import { ActionRow, Button, Embed } from "oceanic-builders";
import { InteractionCollector } from "oceanic-collectors";
import {
  type AnyInteractionGateway,
  type ButtonComponent,
  ButtonStyles,
  ComponentTypes,
  type EmbedOptions,
  InteractionTypes,
  type Message,
  type MessageComponent,
  MessageFlags,
} from "oceanic.js";
import { match } from "ts-pattern";

export class Pagination {
  private context: AnyInteractionGateway | Message;
  private locale: Locales;
  private pages: PaginationPage[];
  private paginationIndex: number;
  private shouldBeEphemeral: boolean;
  private timeBeforeExpiration: number;

  constructor(context: AnyInteractionGateway | Message, options: PaginationOptions) {
    this.context = context;
    this.locale = options.locale;
    this.pages = options.pages;
    this.paginationIndex = 0;
    this.shouldBeEphemeral = !!options.shouldBeEphemeral;
    this.timeBeforeExpiration = options.timeBeforeExpiration ?? 60000;

    (async () => {
      await this.handlePagination();
    })();
  }

  private getPaginationElements = (paginationIndex: number) => {
    const paginationEmbeds = this.pages.map((element) => ("embed" in element ? element.embed : element));
    const paginationComponents = this.pages.map((element) => ("components" in element ? element.components : []));
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

    return paginationElements(paginationIndex);
  };

  private getMessagePayload = (paginationIndex: number) => {
    const { components, embed } = this.getPaginationElements(paginationIndex);

    return {
      components,
      embeds: new Embed(embed).toJSON(true),
      flags: this.shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
    };
  };

  private handlePagination = async () => {
    const messagePayload = this.getMessagePayload(this.paginationIndex);
    const originalMessage = await createMessage(this.context, messagePayload);

    this.handlePaginationCollector(originalMessage);
  };

  private handlePaginationCollector = (message: Message) => {
    const interactionCollector = new InteractionCollector(client, {
      channel: this.context.channel,
      componentType: ComponentTypes.BUTTON,
      idle: this.timeBeforeExpiration,
      interactionType: InteractionTypes.MESSAGE_COMPONENT,
      message,
      filter: async (collectedInteraction) => {
        if (
          ("user" in this.context && collectedInteraction.user.id !== this.context.user.id) ||
          ("author" in this.context && collectedInteraction.user.id !== this.context.author.id)
        ) {
          await createErrorMessage(collectedInteraction, Translations[this.locale].GLOBAL.INVALID_USER_COLLECTOR);

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
            () => (this.paginationIndex = this.paginationIndex > 0 ? --this.paginationIndex : this.pages.length - 1),
          )
          .with(
            "@pagination/right",
            () => (this.paginationIndex = this.paginationIndex + 1 < this.pages.length ? ++this.paginationIndex : 0),
          );

        const row = message.components[0].components;
        let indexButton = row[1] as ButtonComponent;

        indexButton = new Button(indexButton).setLabel(`${this.paginationIndex + 1}/${this.pages.length}`).toJSON();

        const { components, embeds } = this.getMessagePayload(this.paginationIndex);
        const messagePayload = {
          components,
          embeds,
        };

        await client.rest.channels.editMessage(message.channelID, message.id, messagePayload);
      }
    });

    interactionCollector.once("end", async (_, endReason) => {
      if (["user", "guildDelete", "channelDelete", "threadDelete", "messageDelete"].includes(endReason)) return;

      await disableMessageComponents(message);
    });
  };
}

type PaginationOptions = {
  locale: Locales;
  pages: PaginationPage[];
  shouldBeEphemeral?: boolean;
  timeBeforeExpiration?: number;
};
type PaginationPage =
  | {
      components: MessageComponent[];
      embed: EmbedOptions;
    }
  | EmbedOptions;
