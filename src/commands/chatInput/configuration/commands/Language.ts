import { Colors } from "@constants";
import type { GuildConfigurationLocale } from "@prisma/client";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { Embed } from "oceanic-builders";

export default createChatInputSubCommand({
  category: CommandCategory.CONFIGURATION,
  name: "language",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) return;

    const languageOption = context.data.options.getString<GuildConfigurationLocale>("language", true);
    const {
      general: { locale },
    } = await client.prisma.guildConfiguration.upsert({
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
        .setDescription(Translations[locale].COMMANDS.CONFIGURATION.LANGUAGE.MESSAGE_1)
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
