import { ApplicationCommandOptionTypes, type BigString } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { CommandOptions, Declare } from "@util/decorators.js";
import { prisma } from "@util/prisma.js";
import type { Locales } from "@util/types.js";

@Declare({
  description: "Updates the bot locale.",
  name: "locale",
  options: [
    {
      choices: [
        {
          name: "English",
          value: "EN",
        },
        {
          name: "Spanish",
          value: "ES",
        },
      ],
      description: "_",
      name: "locale",
      required: true,
      type: ApplicationCommandOptionTypes.String,
    },
  ],
  type: ApplicationCommandOptionTypes.SubCommand,
})
@CommandOptions({
  permissions: ["MANAGE_GUILD"],
})
export default class LocaleCommand extends ChatInputSubCommand {
  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async run(options: ChatInputSubCommandRunOptions<LocaleOptions>): Promise<void> {
    const { context, options: commandOptions, t } = options;
    const { guildId } = context;

    if (!guildId) {
      return;
    }

    const { locale: localeOptions } = commandOptions;
    const { locale } = localeOptions;
    const upsertedLocale = await this.upsertGuildLocale(guildId, locale);

    await createMessage(
      context,
      t("categories.configuration.locale.message_1", {
        lng: upsertedLocale.toLowerCase(),
      }),
    );
  }

  /**
   * Upserts the guild locale.
   * @param guildIdBigString - The guild id as BigString.
   * @param locale - The chosen locale to upsert.
   * @returns The upserted locale.
   */
  async upsertGuildLocale(guildIdBigString: BigString, locale: Locales): Promise<Locales> {
    const guildId = guildIdBigString.toString();
    const { locale: updatedLocale } = await prisma.guildPreferences.upsert({
      create: {
        guildId,
        locale,
      },
      select: {
        locale: true,
      },
      update: {
        locale,
      },
      where: {
        guildId,
      },
    });

    return updatedLocale;
  }
}

interface LocaleOptions {
  locale: {
    locale: Locales;
  };
}
