import { Colors } from "@constants";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { createErrorMessage } from "@util/utils";
import { Embed } from "oceanic-builders";

export default createChatInputSubCommand({
  category: CommandCategory.CONFIGURATION,
  name: "automations_delete",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context, locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) return;

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
      return await createErrorMessage(context, {
        content: Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.DELETE.AUTOMATION_NOT_FOUND({
          automationId: automationIdOption,
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
          Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.DELETE.MESSAGE_1({
            automationName: name,
          }),
        )
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
