import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { createErrorMessage } from "@utils";

export default createChatInputSubCommand({
  category: CommandCategory.CONFIGURATION,
  name: "automations_list",
  run: async ({ client, context, locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) return;

    const guildAutomations = await client.prisma.guildAutomation.findMany({
      where: {
        guildId: context.guildID,
      },
    });

    if (guildAutomations.length === 0) {
      return await createErrorMessage(context, {
        content: Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.NO_AVAILABLE_AUTOMATIONS,
      });
    }

    return await context.reply({});
  },
});
