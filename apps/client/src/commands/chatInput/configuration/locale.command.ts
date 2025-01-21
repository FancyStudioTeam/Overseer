import { ApplicationCommandOptionTypes } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import type { GuildPreferencesLocale } from "@prisma/client";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { prisma } from "@util/prisma.js";

export default class LocaleCommand extends ChatInputSubCommand {
  constructor() {
    super({
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
    });
  }

  async run({ context, t, options }: ChatInputSubCommandRunOptions<LocaleOptions>): Promise<void> {
    if (!context.guildId) {
      return;
    }

    const { locale: localeOptions } = options;
    const { locale } = localeOptions;
    const guildId = context.guildId.toString();
    /**
     * Upsert the guild preferences locale.
     */
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

    await createMessage(
      context,
      t("categories.configuration.locale.message_1", {
        /**
         * Use the updated locale to translate the message.
         */
        lng: updatedLocale.toLowerCase(),
      }),
    );
  }
}

interface LocaleOptions {
  locale: {
    locale: GuildPreferencesLocale;
  };
}
