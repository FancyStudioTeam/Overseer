import { InteractionCollector } from "oceanic-collector";
import {
  type AnyInteractionGateway,
  type ButtonComponent,
  ButtonStyles,
  ChannelTypes,
  type EmbedOptions,
  InteractionTypes,
  MessageFlags,
} from "oceanic.js";
import { ActionRowBuilder } from "../builders/ActionRow";
import { ButtonBuilder } from "../builders/Button";
import type { Fancycord } from "../classes/Client";
import { errorMessage } from "./util";

export async function pagination(
  main: {
    client: Fancycord;
    language: string;
  },
  context: AnyInteractionGateway,
  pages: EmbedOptions[],
  ephemeral: boolean
): Promise<void> {
  if (!context.inCachedGuildChannel() || !context.guild) return;
  if (!context.channel) return;
  if (context.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (context.user.bot) return;

  let index = 0;

  if ("reply" in context) {
    const response = await context.reply({
      embeds: [pages[index]],
      components: new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
            .setCustomID("pagination-left")
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1210952980166090762",
            })
            .setDisabled(pages.length < 2 ? true : false),
          new ButtonBuilder()
            .setCustomID("pagination-pages")
            .setStyle(ButtonStyles.SECONDARY)
            .setLabel(`${index + 1}/${pages.length}`)
            .setEmoji({
              name: "_",
              id: "1210953586951987240",
            })
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomID("pagination-right")
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1201948012830531644",
            })
            .setDisabled(pages.length < 2 ? true : false),
        ])
        .toJSONArray(),
      flags: ephemeral ? MessageFlags.EPHEMERAL : undefined,
    });
    const message = response.hasMessage()
      ? response.message
      : await response.getMessage();
    const collector = new InteractionCollector({
      client: main.client,
      message: message,
      channel: context.channel,
      guild: context.guild,
      interactionType: InteractionTypes.MESSAGE_COMPONENT,
      idle: 30000,
    });

    collector.on("collect", async (collected: AnyInteractionGateway) => {
      if (collected.isComponentInteraction()) {
        if (collected.user.id !== context.user.id) {
          return errorMessage(collected, true, {
            description: main.client.locales.__({
              phrase: "general.invalid-user-collector",
              locale: main.language,
            }),
          });
        }

        if (collected.isButtonComponentInteraction()) {
          await collected.deferUpdate().catch(() => null);

          switch (collected.data.customID) {
            case "pagination-left": {
              index = index > 0 ? --index : pages.length - 1;

              break;
            }
            case "pagination-right": {
              index = index + 1 < pages.length ? ++index : 0;

              break;
            }
          }

          new ButtonBuilder()
            .load(<ButtonComponent>message.components[0].components[1])
            .setLabel(`${index + 1}/${pages.length}`);

          await collected
            .editOriginal({
              embeds: [pages[index]],
              components: message.components,
            })
            .catch(() => null);
        }
      }
    });

    collector.on("end", async () => {
      collector.removeAllListeners();

      message.components.forEach((r, _) => {
        r.components.forEach((c, _) => {
          c.disabled = true;
        });
      });

      await main.client.rest.interactions
        .editOriginalMessage(context.applicationID, context.token, {
          components: message.components,
        })
        .catch(() => null);
    });
  }
}
