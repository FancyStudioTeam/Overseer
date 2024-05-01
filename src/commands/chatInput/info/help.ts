import {
  type AnyInteractionChannel,
  ApplicationCommandTypes,
  ButtonStyles,
  type CommandInteraction,
  ComponentTypes,
  type Uncached,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../builders/ActionRow";
import { ButtonBuilder } from "../../../builders/Button";
import { EmbedBuilder } from "../../../builders/Embed";
import { SelectMenuBuilder } from "../../../builders/SelectMenu";
import { ChatInputCommand } from "../../../classes/Builders";
import type { Discord } from "../../../classes/Client";
import { Colors, Emojis, Links } from "../../../constants";
import { Translations } from "../../../locales";
import { parseEmoji } from "../../../util/util";

export default new ChatInputCommand({
  name: "help",
  description: "Displays bot commands",
  descriptionLocalizations: {
    "es-419": "Muestra los comandos del bot",
    "es-ES": "Muestra los comandos del bot",
  },
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: "",
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.CHAT_INPUT
    >,
    { locale }
  ) => {
    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: Translations[locale].HELP.MESSAGE_1.AUTHOR_1({
            name: _client.user.globalName ?? _client.user.username,
          }),
        })
        .setThumbnail(_client.user.avatarURL())
        .setDescription(
          Translations[locale].HELP.MESSAGE_1.DESCRIPTION_1({
            mention: _client.user.mention,
          })
        )
        .setColor(Colors.COLOR)
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
              .setCustomID("help_plugins")
              .setPlaceholder(
                Translations[locale].HELP.COMPONENTS.SELECT_MENU.PLUGINS
                  .PLACEHOLDER
              )
              .addOptions(
                ["configuration", "information", "moderation", "utility"].map(
                  (e) => {
                    return {
                      label:
                        Translations[locale].HELP.COMPONENTS.SELECT_MENU.PLUGINS
                          .OPTIONS[<Plugins>e.toUpperCase()].LABEL,
                      value: e,
                      description:
                        Translations[locale].HELP.COMPONENTS.SELECT_MENU.PLUGINS
                          .OPTIONS[<Plugins>e.toUpperCase()].DESCRIPTION,
                      emoji: parseEmoji(
                        {
                          configuration: Emojis.GEAR,
                          information: Emojis.INFO,
                          moderation: Emojis.GAVEL,
                          utility: Emojis.SUPPORT,
                        }[e] ?? ""
                      ),
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
