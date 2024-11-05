import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage, createMessage, noop } from "@util/utils";
import { Attachment } from "oceanic-builders";
import { ComponentTypes } from "oceanic.js";
import { ungzip } from "pako";

export default createButtonComponent({
  name: "@automations_list/download",
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

    const uncompressedBuffer = Buffer.from(ungzip(guildAutomation.general.data));

    return await createMessage(context, {
      files: new Attachment()
        .setContents(uncompressedBuffer)
        .setName(`${guildAutomation.general.name}.yml`)
        .toJSON(true),
    });
  },
});
