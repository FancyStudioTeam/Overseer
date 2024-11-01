import { Colors } from "@constants";
import { codeBlock } from "@discordjs/formatters";
import { Translations } from "@translations";
import { createComponent } from "@util/Handlers";
import { createErrorMessage, noop, truncateString } from "@util/utils";
import { Embed } from "oceanic-builders";
import { ComponentTypes, MessageFlags } from "oceanic.js";
import { ungzip } from "pako";

export default createComponent({
  name: "@automations_list/code",
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

    const uncompressedBuffer = Buffer.from(ungzip(guildAutomation.general.data)).toString();

    return await context.reply({
      embeds: new Embed()
        .setDescription(
          codeBlock(
            "yml",
            truncateString(uncompressedBuffer, {
              maxLength: 4000,
            }),
          ),
        )
        .setColor(Colors.COLOR)
        .toJSON(true),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
