import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage, createMessage, noop } from "@util/utils";

export default createButtonComponent({
  name: "@automations_list/delete",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context, locale, variable: automationId }) => {
    await context.deferUpdate().catch(noop);

    const guildAutomation = await client.prisma.guildAutomation.findUnique({
      where: {
        automationId,
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
        Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.AUTOMATION_NOT_FOUND({
          automationId,
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
      Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.BUTTONS.DELETE.MESSAGE_1({
        automationName,
      }),
    );
  },
});
