import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ApplicationCommandTypes,
  type CommandInteraction,
  ComponentTypes,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../builders/ActionRow";
import { AttachmentBuilder } from "../../../builders/Attachment";
import { EmbedBuilder } from "../../../builders/Embed";
import { SelectMenuBuilder } from "../../../builders/SelectMenu";
import { ChatInputCommand } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";

export default new ChatInputCommand({
  name: "help",
  description: "Displays bot commands",
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: "",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language }
  ) => {
    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        })
        .setThumbnail(client.user.avatarURL())
        .setDescription(
          client.locales.__mf(
            {
              phrase: "commands.information.help.message",
              locale: language,
            },
            {
              mention: client.user.mention,
            }
          )
        )
        .setImage("attachment://banner.png")
        .setColor(client.config.colors.color)
        .toJSONArray(),
      files: new AttachmentBuilder()
        .setName("banner.png")
        .setContent(
          readFileSync(
            join(__dirname, "../../..", "assets/images", "Banner.png")
          )
        )
        .toJSONArray(),
      components: new ActionRowBuilder()
        .addComponents([
          new SelectMenuBuilder()
            .setCustomID("help-plugins")
            .addOptions([
              {
                label: client.locales.__({
                  phrase: "commands.information.help.row.configuration.label",
                  locale: language,
                }),
                value: "configuration",
                description: client.locales.__({
                  phrase:
                    "commands.information.help.row.configuration.description",
                  locale: language,
                }),
                emoji: {
                  name: "_",
                  id: "1201584289473630208",
                },
              },
              {
                label: client.locales.__({
                  phrase: "commands.information.help.row.information.label",
                  locale: language,
                }),
                value: "information",
                description: client.locales.__({
                  phrase:
                    "commands.information.help.row.information.description",
                  locale: language,
                }),
                emoji: {
                  name: "_",
                  id: "1201585353258188820",
                },
              },
              {
                label: client.locales.__({
                  phrase: "commands.information.help.row.moderation.label",
                  locale: language,
                }),
                value: "moderation",
                description: client.locales.__({
                  phrase:
                    "commands.information.help.row.moderation.description",
                  locale: language,
                }),
                emoji: {
                  name: "_",
                  id: "1201585640182141078",
                },
              },
              {
                label: client.locales.__({
                  phrase: "commands.information.help.row.utility.label",
                  locale: language,
                }),
                value: "utility",
                description: client.locales.__({
                  phrase: "commands.information.help.row.utility.description",
                  locale: language,
                }),
                emoji: {
                  name: "_",
                  id: "1201585025028735016",
                },
              },
            ])
            .setType(ComponentTypes.STRING_SELECT),
        ])
        .toJSONArray(),
    });
  },
});
