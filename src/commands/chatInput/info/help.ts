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
import { translations } from "../../../locales/translations";
import { parseEmoji } from "../../../util/util";

export default new ChatInputCommand({
  name: "help",
  description: "Displays bot commands",
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: "",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { locale }
  ) => {
    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        })
        .setThumbnail(client.user.avatarURL())
        .setDescription(
          translations[locale].HELP.MESSAGE.MESSAGE({
            mention: client.user.mention,
          })
        )
        .setImage("attachment://banner.png")
        .setColor(client.config.colors.COLOR)
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
            .setPlaceholder(
              translations[locale].HELP.COMPONENTS.SELECT_MENU.PLACEHOLDER
            )
            .addOptions(
              ["configuration", "information", "moderation", "utility"].map(
                (e) => {
                  const emojis: Record<string, string> = {
                    configuration: client.config.emojis.GEAR,
                    information: client.config.emojis.INFO,
                    moderation: client.config.emojis.GAVEL,
                    utility: client.config.emojis.SUPPORT,
                  };

                  return {
                    label:
                      translations[locale].HELP.COMPONENTS.SELECT_MENU.OPTIONS[
                        <Plugins>e.toUpperCase()
                      ].LABEL,
                    value: e,
                    description:
                      translations[locale].HELP.COMPONENTS.SELECT_MENU.OPTIONS[
                        <Plugins>e.toUpperCase()
                      ].DESCRIPTION,
                    emoji: parseEmoji(emojis[e]),
                  };
                }
              )
            )
            .setType(ComponentTypes.STRING_SELECT),
        ])
        .toJSONArray(),
    });
  },
});

type Plugins = "CONFIGURATION" | "INFORMATION" | "MODERATION" | "UTILITY";
