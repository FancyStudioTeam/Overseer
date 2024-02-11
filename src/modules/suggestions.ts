import { DiscordSnowflake } from "@sapphire/snowflake";
import { ButtonStyles, ChannelTypes, type Message } from "oceanic.js";
import { ActionRowBuilder } from "../builders/ActionRow";
import { ButtonBuilder } from "../builders/Button";
import { EmbedBuilder } from "../builders/Embed";
import type { Fancycord } from "../classes/Client";
import { prisma } from "../util/db";
import { cleanContent, sleep, trim } from "../util/util";

export default (client: Fancycord) => {
  client.on("messageCreate", async (message: Message) => {
    if (!message.guild) return;
    if (!message.channel) return;
    if (message.channel.type !== ChannelTypes.GUILD_TEXT) return;
    if (message.author.bot) return;

    const guildSuggestion = await prisma.guildSuggestion.findUnique({
      where: {
        guild_id: message.guild.id,
      },
    });
    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: message.guild.id,
      },
    });
    const language = guildConfiguration?.language ?? "en";
    const premium = guildConfiguration?.premium ?? false;

    if (
      guildSuggestion?.message_suggestions &&
      message.channel.type === ChannelTypes.GUILD_TEXT &&
      guildSuggestion.channel_id === message.channel.id
    ) {
      const id = DiscordSnowflake.generate().toString();
      let content = message.content;

      if (message.guild.clientMember.permissions.has("MANAGE_MESSAGES")) {
        await message.delete().catch(() => null);
      }

      if (!checkString(content)) {
        content = "**_(No valid content detected)_**";
      }

      if (guildSuggestion.revision_enabled) {
        const channel = message.guild.channels.get(
          guildSuggestion.revision_channel_id,
        );

        if (
          channel &&
          channel.type === ChannelTypes.GUILD_TEXT &&
          channel
            .permissionsOf(message.guild.clientMember)
            .has("VIEW_CHANNEL", "SEND_MESSAGES")
        ) {
          const response = await channel.createMessage({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  client.locales.__({
                    phrase: "commands.utility.suggest.message2",
                    locale: language,
                  }),
                )
                .setColor(client.config.colors.warning)
                .toJSON(),
              new EmbedBuilder()
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.avatarURL(),
                })
                .setThumbnail(message.author.avatarURL())
                .setDescription(cleanContent(trim(content, 4000)))
                .setColor(client.config.colors.color)
                .toJSON(),
            ],
            components: new ActionRowBuilder()
              .addComponents([
                new ButtonBuilder()
                  .setCustomID("suggest-status-approve")
                  .setLabel(
                    client.locales.__({
                      phrase:
                        "commands.utility.suggest.row.status.approve.label",
                      locale: language,
                    }),
                  )
                  .setStyle(ButtonStyles.SECONDARY)
                  .setEmoji({
                    name: "_",
                    id: "1201582315915190312",
                  }),
                new ButtonBuilder()
                  .setCustomID("suggest-status-deny")
                  .setLabel(
                    client.locales.__({
                      phrase: "commands.utility.suggest.row.status.deny.label",
                      locale: language,
                    }),
                  )
                  .setStyle(ButtonStyles.SECONDARY)
                  .setEmoji({
                    name: "_",
                    id: "1201581407290531890",
                  }),
                new ButtonBuilder()
                  .setCustomID("suggest-report")
                  .setLabel(
                    client.locales.__({
                      phrase: "commands.utility.suggest.row.report.label",
                      locale: language,
                    }),
                  )
                  .setStyle(ButtonStyles.DANGER)
                  .setEmoji({
                    name: "_",
                    id: "1201583419524657315",
                  }),
              ])
              .toJSONArray(),
          });

          await prisma.userSuggestion.create({
            data: {
              guild_id: message.guild.id,
              user_id: message.author.id,
              message_id: response.id,
              suggestion_id: id,
              content: cleanContent(trim(content, 4000)),
              status: "UNDER_REVIEW",
            },
          });
        }
      } else {
        if (
          message.channel.type === ChannelTypes.GUILD_TEXT &&
          message.channel
            .permissionsOf(message.guild.clientMember)
            .has("VIEW_CHANNEL", "SEND_MESSAGES")
        ) {
          const response = await message.channel.createMessage({
            embeds: new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setThumbnail(message.author.avatarURL())
              .setDescription(cleanContent(trim(content, 4000)))
              .setColor(client.config.colors.color)
              .toJSONArray(),
            components: new ActionRowBuilder()
              .addComponents([
                new ButtonBuilder()
                  .setCustomID("suggest-upvote")
                  .setLabel("0")
                  .setStyle(ButtonStyles.SECONDARY)
                  .setEmoji({
                    name: "_",
                    id: "1201583878205353994",
                  }),
                new ButtonBuilder()
                  .setCustomID("suggest-downvote")
                  .setLabel("0")
                  .setStyle(ButtonStyles.SECONDARY)
                  .setEmoji({
                    name: "_",
                    id: "1201583875424538675",
                  }),
                new ButtonBuilder()
                  .setCustomID("suggest-manage")
                  .setStyle(ButtonStyles.SECONDARY)
                  .setEmoji({
                    name: "_",
                    id: "1201584289473630208",
                  }),
                new ButtonBuilder()
                  .setCustomID("suggest-report")
                  .setLabel(
                    client.locales.__({
                      phrase: "commands.utility.suggest.row.report.label",
                      locale: language,
                    }),
                  )
                  .setStyle(ButtonStyles.DANGER)
                  .setEmoji({
                    name: "_",
                    id: "1201583419524657315",
                  }),
              ])
              .toJSONArray(),
          });

          await prisma.userSuggestion.create({
            data: {
              guild_id: message.guild.id,
              user_id: message.author.id,
              message_id: response.id,
              suggestion_id: id,
              content: cleanContent(trim(content, 4000)),
              status: "PENDING",
            },
          });

          if (guildSuggestion.threads && premium) {
            await sleep(1500);
            await response
              .startThread({
                name: `${message.author.username} suggestion`,
                autoArchiveDuration: 1440,
                reason:
                  'The suggestion system has the "threads" option enabled',
              })
              .catch(() => null);
          }
        }
      }
    }
  });
};

function checkString(content: string): boolean {
  if (!content || !content.length) return false;

  return !/^[^a-zA-Z0-9]+$/.test(content);
}
