import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { createErrorMessage, createMessage } from "@util/utils";

export default createChatInputSubCommand({
  category: CommandCategory.CONFIGURATION,
  name: "automations_delete",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context, locale }) => {
    const automationIdOption = context.data.options.getString("automation_id", true);
    const guildAutomation = await client.prisma.guildAutomation.findUnique({
      where: {
        automationId: automationIdOption,
        general: {
          is: {
            guildId: context.guildID,
          },
        },
      },
    });

    if (!guildAutomation) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.DELETE.AUTOMATION_NOT_FOUND({
          automationId: automationIdOption,
        }),
      );
    }

    const {
      general: { name: automationName },
    } = await client.prisma.guildAutomation.delete({
      where: {
        automationId: guildAutomation.automationId,
        general: {
          is: {
            guildId: guildAutomation.general.guildId,
          },
        },
      },
    });

    return await createMessage(
      context,
      Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.DELETE.MESSAGE_1({
        automationName,
      }),
    );
  },
});
