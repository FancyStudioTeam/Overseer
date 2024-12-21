import type { GuildConfigurationLocale } from "@prisma/client";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { createMessage } from "@utils";

export default createChatInputSubCommand({
  category: CommandCategory.CONFIGURATION,
  name: "language",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context }) => {
    const languageOption = context.data.options.getString<GuildConfigurationLocale>("language", true);
    const { locale } = await client.prisma.guildConfiguration.upsert({
      create: {
        guildId: context.guildID,
        locale: languageOption,
      },
      select: {
        locale: true,
      },
      update: {
        locale: languageOption,
      },
      where: {
        guildId: context.guildID,
      },
    });

    await createMessage(context, Translations[locale].COMMANDS.CONFIGURATION.LANGUAGE.MESSAGE_1);
  },
});
