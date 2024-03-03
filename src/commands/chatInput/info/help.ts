import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ApplicationCommandTypes,
  ButtonStyles,
  type CommandInteraction,
  ComponentTypes,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../builders/ActionRow";
import { AttachmentBuilder } from "../../../builders/Attachment";
import { ButtonBuilder } from "../../../builders/Button";
import { EmbedBuilder } from "../../../builders/Embed";
import { SelectMenuBuilder } from "../../../builders/SelectMenu";
import { ChatInputCommand } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { Colors, Emojis, Links } from "../../../constants";
import { Translations } from "../../../locales/index";
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
          Translations[locale].HELP.MESSAGE_1.DESCRIPTION({
            mention: client.user.mention,
          })
        )
        .setImage("attachment://banner.png")
        .setColor(Colors.COLOR)
        .toJSONArray(),
      files: new AttachmentBuilder()
        .setName("banner.png")
        .setContent(
          readFileSync(
            join(__dirname, "../../..", "assets/images", "Banner.png")
          )
        )
        .toJSONArray(),
      components: [
        new ActionRowBuilder()
          .addComponents([
            new ButtonBuilder()
              .setLabel(
                Translations[locale].HELP.COMPONENTS.BUTTONS.ADD_TO_DISCORD
                  .LABEL
              )
              .setStyle(ButtonStyles.LINK)
              .setEmoji(parseEmoji(Emojis.SUPPORT))
              .setURL(Links.INVITE),
            new ButtonBuilder()
              .setLabel(
                Translations[locale].HELP.COMPONENTS.BUTTONS.SUPPORT_SERVER
                  .LABEL
              )
              .setStyle(ButtonStyles.LINK)
              .setEmoji(parseEmoji(Emojis.SUPPORT))
              .setURL(Links.SUPPORT),
          ])
          .toJSON(),
        new ActionRowBuilder()
          .addComponents([
            new SelectMenuBuilder()
              .setCustomID("help-plugins")
              .setPlaceholder(
                Translations[locale].HELP.COMPONENTS.SELECT_MENU.PLUGINS
                  .PLACEHOLDER
              )
              .addOptions(
                ["configuration", "information", "moderation", "utility"].map(
                  (e) => {
                    const emojis: Record<string, string> = {
                      configuration: Emojis.GEAR,
                      information: Emojis.INFO,
                      moderation: Emojis.GAVEL,
                      utility: Emojis.SUPPORT,
                    };

                    return {
                      label:
                        Translations[locale].HELP.COMPONENTS.SELECT_MENU.PLUGINS
                          .OPTIONS[<Plugins>e.toUpperCase()].LABEL,
                      value: e,
                      description:
                        Translations[locale].HELP.COMPONENTS.SELECT_MENU.PLUGINS
                          .OPTIONS[<Plugins>e.toUpperCase()].DESCRIPTION,
                      emoji: parseEmoji(emojis[e]),
                    };
                  }
                )
              )
              .setType(ComponentTypes.STRING_SELECT),
          ])
          .toJSON(),
      ],
    });
  },
});

type Plugins = "CONFIGURATION" | "INFORMATION" | "MODERATION" | "UTILITY";
