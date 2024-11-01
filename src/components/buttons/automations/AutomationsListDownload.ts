import { Translations } from "@translations";
import { createComponent } from "@util/Handlers";
import { createErrorMessage, noop } from "@util/utils";
import { Attachment } from "oceanic-builders";
import { ComponentTypes, MessageFlags } from "oceanic.js";
import { ungzip } from "pako";

export default createComponent({
  name: "@automations_list/download",
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

    const uncompressedBuffer = Buffer.from(ungzip(guildAutomation.general.data));

    return await context.reply({
      files: new Attachment()
        .setContents(uncompressedBuffer)
        .setName(`${guildAutomation.general.name}.yml`)
        .toJSON(true),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
