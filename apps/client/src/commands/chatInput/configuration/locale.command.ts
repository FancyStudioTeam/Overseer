import { ApplicationCommandOptionTypes, type BigString } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { Declare, InstanceOptions } from "@util/decorators.js";
import { prisma } from "@util/prisma.js";
import type { Locales } from "@util/types.js";

@Declare({
  description: "Updates the bot language.",
  descriptionLocalizations: {
    "es-419": "Actualiza el idioma del bot",
    "es-ES": "Actualiza el idioma del bot",
  },
  name: "locale",
  options: [
    {
      choices: [
        {
          name: "🇬🇧 Update to English",
          // @ts-ignore: Discordeno issue.
          nameLocalizations: {
            "es-419": "🇬🇧 Actualizar al Inglés",
            "es-ES": "🇬🇧 Actualizar al Inglés",
          },
          value: "EN",
        },
        {
          name: "🇪🇸 Update to Spanish",
          // @ts-ignore: Discordeno issue.
          nameLocalizations: {
            "es-419": "🇪🇸 Actualizar al Español",
            "es-ES": "🇪🇸 Actualizar al Español",
          },
          value: "ES",
        },
      ],
      description: "Select the language to update",
      descriptionLocalizations: {
        "es-419": "Selecciona el idioma para actualizar",
        "es-ES": "Selecciona el idioma para actualizar",
      },
      name: "locale",
      required: true,
      type: ApplicationCommandOptionTypes.String,
    },
  ],
})
@InstanceOptions({
  permissions: ["MANAGE_GUILD"],
})
export default class LocaleCommand extends ChatInputSubCommand {
  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async _run(options: ChatInputSubCommandRunOptions<LocaleOptions>): Promise<unknown> {
    const { context, options: commandOptions, t } = options;
    const { guildId } = context;

    if (!guildId) {
      throw new Error("Cannot execute this command without a guild id.");
    }

    const { locale: localeOptions } = commandOptions;
    const { locale } = localeOptions;
    const upsertedLocale = await this.upsertGuildLocale(guildId, locale);

    return await createMessage(
      context,
      t("categories.configuration.locale.message_1", {
        lng: upsertedLocale.toLowerCase(),
      }),
      {
        isEphemeral: false,
      },
    );
  }

  /**
   * Upserts the guild locale.
   * @param guildIdBigString - The guild id as BigString.
   * @param locale - The locale to upsert.
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
