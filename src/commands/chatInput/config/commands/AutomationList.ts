import { Translations } from "@translations";
import { createChatInputSubCommand } from "@util/Handlers";
import { prisma } from "@util/Prisma";
import { errorMessage } from "@utils";

export default createChatInputSubCommand({
  name: "automations_list",
  run: async ({ context, locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) return;

    const guildAutomations = await prisma.guildAutomation.findMany({
      where: {
        guildId: context.guildID,
      },
    });

    if (guildAutomations.length === 0) {
      return await errorMessage(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.NO_AVAILABLE_AUTOMATIONS, {
        context,
      });
    }

    return await context.reply({});
  },
});
