import { Emojis } from "@constants";
import { client } from "@index";
import { Translations } from "@translations";
import type { Locales } from "@types";
import { createErrorMessage, createMessage, disableMessageComponents, noop, parseEmoji } from "@utils";
import { chunk } from "es-toolkit";
import { ActionRow, Button, Embed } from "oceanic-builders";
import { InteractionCollector } from "oceanic-collectors";
import {
  type AnyInteractionGateway,
  type ButtonComponent,
  ButtonStyles,
  ComponentTypes,
  type EmbedOptions,
  InteractionTypes,
  Message,
  type MessageComponent,
  MessageFlags,
} from "oceanic.js";
import { match } from "ts-pattern";

export class Pagination {
  private readonly context: AnyInteractionGateway | Message;
  private readonly locale: Locales;
  private readonly messageAction: PaginationMessageActions;
  private readonly pages: PaginationPage[];
  private paginationIndex: number;
  private readonly shouldBeEphemeral: boolean;
  private readonly timeBeforeExpiration: number;

  constructor(context: AnyInteractionGateway | Message, options: PaginationOptions) {
    this.context = context;
    this.locale = options.locale;
    this.messageAction = options.messageAction ?? PaginationMessageActions.CREATE;
    this.pages = options.pages;
    this.paginationIndex = 0;
    this.shouldBeEphemeral = !!options.shouldBeEphemeral;
    this.timeBeforeExpiration = options.timeBeforeExpiration ?? 60000;

    this.handlePagination();
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
            new Button()
              .setCustomID("@pagination/stop")
              .setStyle(ButtonStyles.DANGER)
              .setEmoji(parseEmoji(Emojis.STOP)),
          ])
          .toJSON(),
      ];

      if (paginationComponents[index].length > 0) {
        const chunkComponents = chunk(paginationComponents[index], 5);

        for (const chunk of chunkComponents) {
          components.push(new ActionRow().addComponents(chunk).toJSON());
        }
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

  private handlePagination = () => {
    const messagePayload = this.getMessagePayload(this.paginationIndex);

    match(this.messageAction)
      .with(PaginationMessageActions.CREATE, async () => {
        const message = await createMessage(this.context, messagePayload);

        this.handlePaginationCollector(message);
      })
      .with(PaginationMessageActions.EDIT, async () => {
        const originalMessage =
          this.context instanceof Message ? this.context : "message" in this.context && this.context.message;

        if (originalMessage) {
          const message = await client.rest.channels.editMessage(
            originalMessage.channelID,
            originalMessage.id,
            messagePayload,
          );

          this.handlePaginationCollector(message);
        }
      });
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
        if (!["@pagination/left", "@pagination/right", "@pagination/stop"].includes(collectedInteraction.data.customID))
          return;

        await collectedInteraction.deferUpdate().catch(noop);

        const matchResult = match(collectedInteraction.data.customID)
          .with(
            "@pagination/left",
            () => (this.paginationIndex = this.paginationIndex > 0 ? --this.paginationIndex : this.pages.length - 1),
          )
          .with(
            "@pagination/right",
            () => (this.paginationIndex = this.paginationIndex + 1 < this.pages.length ? ++this.paginationIndex : 0),
          )
          .with("@pagination/stop", () => interactionCollector.stop())
          .run();

        if (typeof matchResult === "number") {
          const firstRow = message.components[0];
          let indexButton = firstRow.components[1] as ButtonComponent;
          const messagePayload = this.getMessagePayload(this.paginationIndex);

          indexButton = new Button(indexButton).setLabel(`${this.paginationIndex + 1}/${this.pages.length}`).toJSON();

          await client.rest.channels.editMessage(message.channelID, message.id, messagePayload);
        }
      }
    });

    interactionCollector.once("end", async (_, endReason) => {
      if (["guildDelete", "channelDelete", "threadDelete", "messageDelete"].includes(endReason)) return;

      await disableMessageComponents(message);
    });
  };
}

type PaginationOptions = {
  locale: Locales;
  messageAction?: PaginationMessageActions;
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

export enum PaginationMessageActions {
  CREATE,
  EDIT,
}
