import { Colors } from "@constants";
import { codeBlock } from "@discordjs/formatters";
import { Translations } from "@translations";
import type { Locales } from "@types";
import { CommandCategory, createSelectMenuComponent } from "@util/Handlers";
import { createErrorMessage, createMessage, formatKeyValues, noop, truncateString } from "@utils";
import { Embed } from "oceanic-builders";
import { ApplicationCommandOptionTypes, type ApplicationCommandOptions, ComponentTypes } from "oceanic.js";

const ABBREVIATED_COMMAND_NAMES: Record<CommandCategory, string> = {
  [CommandCategory.CONFIGURATION]: "config",
  [CommandCategory.INFORMATION]: "info",
  [CommandCategory.UTILITY]: "util",
};
const LOCALIZED_COMMAND_DESCRIPTIONS: (data: ApplicationCommandOptions) => Record<Locales, string> = (
  data: ApplicationCommandOptions,
) => ({
  EN: data.description,
  ES: data.descriptionLocalizations?.["es-ES"] ?? data.description,
});
const getLocalizedCommandDescription = (data: ApplicationCommandOptions, locale: Locales) =>
  LOCALIZED_COMMAND_DESCRIPTIONS(data)[locale];

export default createSelectMenuComponent({
  name: "@help/categories",
  type: ComponentTypes.STRING_SELECT,
  run: async ({ client, context, locale }) => {
    await context.deferUpdate().catch(noop);

    const options = context.data.values.getStrings();
    const category = Number.parseInt(options[0]) as CommandCategory;
    const parentCommandName = ABBREVIATED_COMMAND_NAMES[category];
    const parentCommand = client.interactions.chatInput.get(parentCommandName);

    if (!parentCommand?.options) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.INFORMATION.HELP.COMPONENTS.SELECT_MENUS.CATEGORIES.COMMAND_NOT_FOUND({
          commandName: parentCommandName,
        }),
      );
    }

    const availableCommandList = parentCommand.options.flatMap((subCommand) => {
      if (subCommand.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP && subCommand.options) {
        return subCommand.options
          .filter((option) => option.type === ApplicationCommandOptionTypes.SUB_COMMAND)
          .map((option) => {
            const { description, name } = {
              description: getLocalizedCommandDescription(option, locale),
              name: [subCommand.name, option.name].join(" "),
            };

            return truncateString(`${name} » ${description}`, {
              maxLength: 75,
            });
          });
      }

      const { description, name } = {
        description: getLocalizedCommandDescription(subCommand, locale),
        name: subCommand.name,
      };

      return truncateString(`${name} » ${description}`, {
        maxLength: 75,
      });
    });

    return await createMessage(
      context,
      new Embed()
        .setDescription(codeBlock("ansi", formatKeyValues(availableCommandList.join("\n"), "»")))
        .setColor(Colors.COLOR)
        .toJSON(),
    );
  },
});