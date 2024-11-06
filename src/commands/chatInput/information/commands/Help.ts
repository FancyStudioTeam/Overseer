import { Colors, Emojis } from "@constants";
import { Translations } from "@translations";
import type { Locales } from "@types";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { createMessage, parseEmoji } from "@util/utils";
import { groupBy } from "es-toolkit";
import { ActionRow, Embed, StringSelectMenu, StringSelectMenuOption } from "oceanic-builders";
import type { NullablePartialEmoji } from "oceanic.js";

const LABEL_TRANSLATIONS: LabelTranslations = {
  EN: {
    [CommandCategory.CONFIGURATION]: "Configuration",
    [CommandCategory.INFORMATION]: "Information",
    [CommandCategory.UTILITY]: "Utility",
  },
  ES: {
    [CommandCategory.CONFIGURATION]: "Configuración",
    [CommandCategory.INFORMATION]: "Información",
    [CommandCategory.UTILITY]: "Útilidad",
  },
};
const COMMANDS_LABEL_TRANSLATIONS: CommandsLabelTranslations = (commandsLength) => ({
  EN: `(${commandsLength} Commands)`,
  ES: `(${commandsLength} Comandos)`,
});
const SELECT_MENU_OPTION_EMOJIS: SelectMenuOptionEmoji = {
  [CommandCategory.CONFIGURATION]: parseEmoji(Emojis.SETTINGS),
  [CommandCategory.INFORMATION]: parseEmoji(Emojis.INFO),
  [CommandCategory.UTILITY]: parseEmoji(Emojis.SUPPORT),
};
const getSelectMenuOption = (category: CommandCategory, commandsLength: number, locale: Locales) =>
  new StringSelectMenuOption()
    .setLabel([LABEL_TRANSLATIONS[locale][category], COMMANDS_LABEL_TRANSLATIONS(commandsLength)[locale]].join(" "))
    .setEmoji(SELECT_MENU_OPTION_EMOJIS[category])
    .setValue(String(category))
    .toJSON();

export default createChatInputSubCommand({
  category: CommandCategory.INFORMATION,
  name: "help",
  run: async ({ client, context, locale }) => {
    const commandGroups = groupBy(client.subCommands.toArray(), ({ category }) => category);
    const categories = Object.keys(commandGroups) as unknown as CommandCategory[];
    const availableSelectMenuOptions = categories.map((category) =>
      getSelectMenuOption(category, commandGroups[category].length, locale),
    );

    await createMessage(context, {
      components: new ActionRow()
        .addComponents([
          new StringSelectMenu()
            .setCustomID("@help/categories")
            .setPlaceholder(
              Translations[locale].COMMANDS.INFORMATION.HELP.COMPONENTS.SELECT_MENUS.CATEGORIES.PLACEHOLDER,
            )
            .addOptions(availableSelectMenuOptions),
        ])
        .toJSON(true),
      embeds: new Embed()
        .setDescription(Translations[locale].COMMANDS.INFORMATION.HELP.MESSAGE_1.DESCRIPTION_1)
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});

type CommandsLabelTranslations = (commandsLength: number) => Record<Locales, string>;
type LabelTranslations = Record<Locales, Record<CommandCategory, string>>;
type SelectMenuOptionEmoji = Record<CommandCategory, NullablePartialEmoji>;
