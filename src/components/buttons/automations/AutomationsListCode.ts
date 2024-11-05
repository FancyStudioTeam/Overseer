import { codeBlock } from "@discordjs/formatters";
import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage, createMessage, noop, truncateString } from "@util/utils";
import { ComponentTypes } from "oceanic.js";
import { ungzip } from "pako";

export default createButtonComponent({
  name: "@automations_list/code",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  type: ComponentTypes.BUTTON,
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

    const uncompressedBuffer = Buffer.from(ungzip(guildAutomation.general.data)).toString();

    return await createMessage(
      context,
      codeBlock(
        "yml",
        truncateString(uncompressedBuffer, {
          maxLength: 4000,
        }),
      ),
    );
  },
});
