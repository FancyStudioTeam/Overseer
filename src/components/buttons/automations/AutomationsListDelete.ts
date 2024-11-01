import { Colors } from "@constants";
import { Translations } from "@translations";
import { createComponent } from "@util/Handlers";
import { createErrorMessage, noop } from "@util/utils";
import { Embed } from "oceanic-builders";
import { ComponentTypes, MessageFlags } from "oceanic.js";

export default createComponent({
  name: "@automations_list/delete",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  type: ComponentTypes.BUTTON,
  run: async ({ client, context, locale, variable: automationId }) => {
    await context.deferUpdate().catch(noop);

    if (!(context.inCachedGuildChannel() && context.guild)) return;

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
      return await createErrorMessage(context, {
        content: Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.AUTOMATION_NOT_FOUND({
          automationId,
        }),
      });
    }

    const {
      general: { name },
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

    return await context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.BUTTONS.DELETE.MESSAGE_1({
            automationName: name,
          }),
        )
        .setColor(Colors.COLOR)
        .toJSON(true),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
