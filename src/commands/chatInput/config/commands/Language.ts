import { Embed } from "oceanic-builders";
import { Colors } from "#constants";
import { Translations } from "#translations";
import type { Locales } from "#types";
import { createChatInputSubCommand } from "#util/Handlers";
import { prisma } from "#util/Prisma";

export default createChatInputSubCommand({
  name: "language",
  run: async ({ context }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) return;

    const languageOption = context.data.options.getString("language", true);
    const {
      general: { locale },
    } = await prisma.guildConfiguration.upsert({
      create: {
        general: {
          locale: languageOption,
        },
        guildId: context.guildID,
        premium: {},
      },
      select: {
        general: true,
      },
      update: {
        general: {
          locale: languageOption,
        },
      },
      where: {
        guildId: context.guildID,
      },
    });

    await context.reply({
      embeds: new Embed()
        .setDescription(Translations[locale as Locales].COMMANDS.CONFIGURATION.LOCALE.MESSAGE_1)
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
