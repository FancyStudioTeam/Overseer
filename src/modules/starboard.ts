import type {
  //type Attachment,
  //ButtonStyles,
  Member,
  PartialEmoji,
  PossiblyUncachedMessage,
  Uncached,
  User,
} from "oceanic.js";
/*import { ActionRowBuilder } from "../builders/ActionRow";
import { ButtonBuilder } from "../builders/Button";
import { EmbedBuilder } from "../builders/Embed";*/
import type { Fancycord } from "../classes/Client";
//import { prisma } from "../util/db";

export default (client: Fancycord) => {
  client.on(
    "messageReactionAdd",
    async (
      message: PossiblyUncachedMessage,
      _reactor: User | Member | Uncached,
      reaction: PartialEmoji,
      _burst: boolean,
    ) => {
      if (!message.guild) return;
      if (!message.channel) return;
      if (reaction.name !== "⭐") return;

      /*const guildConfiguration = await prisma.guildConfiguration.findUnique({
        where: {
          guild_id: message.guild.id,
        },
      });
      const language = guildConfiguration?.language ?? "en";
      const originalMessage = await client.rest.channels
        .getMessage(message.channelID, message.id)
        .catch(() => null);

      if (originalMessage?.author.bot) return;

      if (originalMessage?.reactions.some((r) => r.emoji.name === "⭐")) {
        const reaction = originalMessage.reactions.find(
          (r) => r.emoji.name === "⭐",
        );

        if (reaction && reaction.count >= 2) {
          let attachment: Attachment | undefined;

          if (originalMessage.attachments.size) {
            attachment = originalMessage.attachments.filter(
              (a) =>
                a.contentType &&
                ["image/png", "image/jpeg"].includes(a.contentType),
            )[0];
          }

          await client.rest.channels.createMessage("1208718281242976267", {
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: originalMessage.author.username,
                  iconURL: originalMessage.author.avatarURL(),
                })
                .setDescription(originalMessage.content)
                .setImage(attachment?.proxyURL ?? "")
                .setColor(client.config.colors.WARNING)
                .toJSON(),
              new EmbedBuilder()
                .addFields([
                  {
                    name: client.locales.__({
                      phrase: "modules.starboard.message.field",
                      locale: language,
                    }),
                    value: `<:_:1201948012830531644> ${
                      originalMessage.channel?.mention ??
                      "<:_:1201586248947597392>"
                    }`,
                    inline: true,
                  },
                  {
                    name: client.locales.__({
                      phrase: "modules.starboard.message.field2",
                      locale: language,
                    }),
                    value: `<:_:1201948012830531644> ${originalMessage.author.mention}`,
                    inline: true,
                  },
                ])
                .setColor(client.config.colors.COLOR)
                .toJSON(),
            ],
            components: new ActionRowBuilder()
              .addComponents([
                new ButtonBuilder()
                  .setLabel(
                    client.locales.__({
                      phrase: "modules.starboard.row.message.label",
                      locale: language,
                    }),
                  )
                  .setStyle(ButtonStyles.LINK)
                  .setEmoji({
                    name: "_",
                    id: "1201589945853296780",
                  })
                  .setURL(originalMessage.jumpLink),
              ])
              .toJSONArray(),
          });
        }
      }*/
    },
  );
};
