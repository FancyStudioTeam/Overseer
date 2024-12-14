import { Emojis } from "@constants";
import { client } from "@index";
import { Translations } from "@translations";
import type { Locales, MaybeNullish, MessagePayload } from "@types";
import { createErrorMessage } from "@utils";
import { chunk, noop } from "es-toolkit";
import { ActionRowBuilder, EmbedBuilder, SecondaryButtonBuilder } from "oceanic-builders";
import { InteractionCollector } from "oceanic-collectors";
import {
  type AnyInteractionGateway,
  type ComponentInteraction,
  ComponentTypes,
  type EmbedOptions,
  InteractionTypes,
  Message,
  type MessageComponent,
  MessageFlags,
  type TextButton,
} from "oceanic.js";
import { match } from "ts-pattern";

export class Pagination {
  private readonly context: AnyInteractionGateway | Message;
  private readonly locale: Locales;
  private readonly pages: PaginationPage[];
  private paginationIndex: number;
  private readonly shouldBeEphemeral: boolean;
  private readonly timeBeforeExpiration: number;

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
        new ActionRowBuilder()
          .addComponents([
            new SecondaryButtonBuilder()
              .setCustomID("@pagination/left")
              .setEmoji(Emojis.ARROW_CIRCLE_LEFT)
              .setDisabled(paginationEmbeds.length <= 1),
            new SecondaryButtonBuilder()
              .setCustomID("@pagination/pages")
              .setLabel(`${paginationIndex + 1}/${paginationEmbeds.length}`)
              .setEmoji(Emojis.EXPLORE)
              .setDisabled(),
            new SecondaryButtonBuilder()
              .setCustomID("@pagination/right")
              .setEmoji(Emojis.ARROW_CIRCLE_RIGHT)
              .setDisabled(paginationEmbeds.length <= 1),
          ])
          .toJSON(),
      ];

      if (paginationComponents[index].length > 0) {
        const chunkComponents = chunk(paginationComponents[index], 5);

        for (const chunk of chunkComponents) {
          components.push(new ActionRowBuilder().addComponents(chunk).toJSON());
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
      embeds: new EmbedBuilder(embed).toJSON(true),
      flags: this.shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
    };
  };

  private handleMessageData = async () => {
    const messagePayload = this.getMessagePayload(this.paginationIndex);
    const messageResponse =
      "reply" in this.context
        ? await this.context.reply(messagePayload)
        : await client.rest.channels.createMessage(this.context.channelID, messagePayload);
    const message =
      "hasMessage" in messageResponse
        ? messageResponse.hasMessage()
          ? messageResponse.message
          : await messageResponse.getMessage()
        : messageResponse;
    const interaction = (
      "hasMessage" in messageResponse ? messageResponse.interaction : undefined
    ) as MaybeNullish<ComponentInteraction>;

    return interaction
      ? {
          interaction,
          message,
        }
      : message;
  };

  private handlePagination = async () => {
    const messageData = await this.handleMessageData();

    this.handlePaginationCollector(messageData);
  };

  private handlePaginationCollector = (paginationData: Awaited<ReturnType<typeof this.handleMessageData>>) => {
    const message = paginationData instanceof Message ? paginationData : paginationData.message;
    const interactionCollector = new InteractionCollector(client, {
      channel: this.context.channel,
      componentType: ComponentTypes.BUTTON,
      idle: this.timeBeforeExpiration,
      interactionType: InteractionTypes.MESSAGE_COMPONENT,
      message,
      filter: async (collectedInteraction) => {
        const originalCollectionUser = "user" in this.context ? this.context.user : this.context.author;

        if (!collectedInteraction.data.customID.startsWith("@pagination/")) {
          return false;
        }

        if (collectedInteraction.user.id !== originalCollectionUser.id) {
          await createErrorMessage(collectedInteraction, Translations[this.locale].GLOBAL.INVALID_USER_COLLECTOR);

          return false;
        }

        return true;
      },
    });

    interactionCollector.on("collect", async (collectedInteraction) => {
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

      const firstRow = message.components[0];
      let indexButton = firstRow.components[1] as TextButton;
      const messagePayload = this.getMessagePayload(this.paginationIndex);

      indexButton = new SecondaryButtonBuilder(indexButton)
        .setLabel(`${this.paginationIndex + 1}/${this.pages.length}`)
        .toJSON();

      await this.handleMessageEdit(paginationData, messagePayload);
    });

    interactionCollector.once("end", async (_, endReason) => {
      if (["guildDelete", "channelDelete", "threadDelete", "messageDelete"].includes(endReason)) return;

      const messagePayload = {
        components: message.components,
      };

      for (const row of message.components) {
        for (const component of row.components) {
          component.disabled = true;
        }
      }

      await this.handleMessageEdit(paginationData, messagePayload);
    });
  };

  private handleMessageEdit = async (
    paginationData: Awaited<ReturnType<typeof this.handleMessageData>>,
    messagePayload: MessagePayload,
  ) => {
    const message = paginationData instanceof Message ? paginationData : paginationData.message;
    const interaction =
      "message" in paginationData && "interaction" in paginationData ? paginationData.interaction : undefined;

    interaction
      ? await interaction.editFollowup(message.id, messagePayload)
      : await client.rest.channels.editMessage(message.channelID, message.id, messagePayload);
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
