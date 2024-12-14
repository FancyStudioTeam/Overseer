import { Colors, Emojis } from "@constants";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { Pagination } from "@util/Pagination";
import { createErrorMessage } from "@utils";
import { EmbedBuilder, EmbedFieldBuilder, SecondaryButtonBuilder } from "oceanic-builders";
import { ungzip } from "pako";

const MAXIMUM_KILOBYTES = (isPremium: boolean) => (isPremium ? 10 : 5);

export default createChatInputSubCommand({
  category: CommandCategory.CONFIGURATION,
  name: "automations_list",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context, isPremium, locale }) => {
    const guildAutomations = await client.prisma.guildAutomation.findMany({
      where: {
        general: {
          is: {
            guildId: context.guildID,
          },
        },
      },
    });

    if (guildAutomations.length === 0) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.NO_AVAILABLE_AUTOMATIONS,
      );
    }

    const availableAutomationsPages = guildAutomations.map(
      async ({ automationId, createdAt, general: { createdBy, data, name: automationName } }) => {
        const user = await client.fetchUser(createdBy);
        const uncompressedBuffer = Buffer.from(ungzip(data));
        const bufferSizeInKiloBytes = Buffer.from(uncompressedBuffer).length / 1000;
        const { currentSize, maximumSize } = {
          currentSize: Math.round(bufferSizeInKiloBytes),
          maximumSize: Math.round(MAXIMUM_KILOBYTES(isPremium)),
        };

        return {
          components: [
            new SecondaryButtonBuilder()
              .setCustomID(`@automations_list/code#${automationId}`)
              .setLabel(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.BUTTONS.DISPLAY.LABEL)
              .setEmoji(Emojis.CODE_BLOCKS)
              .toJSON(),
            new SecondaryButtonBuilder()
              .setCustomID(`@automations_list/download#${automationId}`)
              .setLabel(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.BUTTONS.DOWNLOAD.LABEL)
              .setEmoji(Emojis.DOWNLOAD)
              .toJSON(),
            new SecondaryButtonBuilder()
              .setCustomID(`@automations_list/delete#${automationId}`)
              .setLabel(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.BUTTONS.DELETE.LABEL)
              .setEmoji(Emojis.TRASH_COLORED)
              .toJSON(),
          ],
          embed: new EmbedBuilder()
            .setTitle(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.TITLE_1)
            .addFields([
              new EmbedFieldBuilder()
                .setName(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_1.NAME)
                .setValue(
                  Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_1.VALUE({
                    automationId,
                    automationName,
                    createdBy: user?.name ?? "Unknown User",
                  }),
                ),
              new EmbedFieldBuilder()
                .setName(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_2.NAME)
                .setValue(
                  Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_2.VALUE({
                    createdAt,
                  }),
                ),
              new EmbedFieldBuilder()
                .setName(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_3.NAME)
                .setValue(
                  Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_3.VALUE({
                    currentSize,
                    maximumSize,
                  }),
                ),
            ])
            .setColor(Colors.COLOR)
            .toJSON(),
        };
      },
    );

    return new Pagination(context, {
      locale,
      pages: await Promise.all(availableAutomationsPages),
    });
  },
});
