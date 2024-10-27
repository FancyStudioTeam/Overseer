import { Colors, Emojis } from "@constants";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { pagination } from "@util/Pagination";
import { createErrorMessage, parseEmoji } from "@utils";
import { Button, Embed, EmbedField } from "oceanic-builders";
import { ButtonStyles } from "oceanic.js";
import { ungzip } from "pako";

const MAXIMUM_KILOBYTES = (isPremium: boolean) => (isPremium ? 10 : 5);

export default createChatInputSubCommand({
  category: CommandCategory.CONFIGURATION,
  name: "automations_list",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context, isPremium, locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) return;

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
      return await createErrorMessage(context, {
        content: Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.NO_AVAILABLE_AUTOMATIONS,
      });
    }

    const availableAutomationsPages = guildAutomations.map(
      async ({ automationId, createdAt, general: { createdBy, data, name: automationName } }) => {
        const user = await client.fetchUser(createdBy);
        const uncompressedBuffer = Buffer.from(ungzip(data));
        const bufferSizeInKiloBytes = Buffer.from(uncompressedBuffer).length / 1024;

        return {
          embed: new Embed()
            .setTitle(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.TITLE_1)
            .addFields([
              new EmbedField()
                .setName(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_1.NAME)
                .setValue(
                  Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_1.VALUE({
                    automationId,
                    automationName,
                    createdBy: user?.name ?? "Unknown User",
                  }),
                ),
              new EmbedField()
                .setName(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_2.NAME)
                .setValue(
                  Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_2.VALUE({
                    createdAt,
                  }),
                ),
              new EmbedField()
                .setName(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_3.NAME)
                .setValue(
                  Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.MESSAGE_1.FIELD_3.VALUE({
                    currentSize: bufferSizeInKiloBytes,
                    maximumSize: MAXIMUM_KILOBYTES(isPremium),
                  }),
                ),
            ])
            .setColor(Colors.COLOR)
            .toJSON(),
          components: [
            new Button()
              .setCustomID(`@automations_list/code#${automationId}`)
              .setLabel(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.BUTTONS.DISPLAY.LABEL)
              .setStyle(ButtonStyles.SECONDARY)
              .setEmoji(parseEmoji(Emojis.CODE_BLOCKS))
              .toJSON(),
            new Button()
              .setCustomID(`@automations_list/download#${automationId}`)
              .setLabel(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.BUTTONS.DOWNLOAD.LABEL)
              .setStyle(ButtonStyles.SECONDARY)
              .setEmoji(parseEmoji(Emojis.DOWNLOAD))
              .toJSON(),
            new Button()
              .setCustomID(`@automations_list/delete#${automationId}`)
              .setLabel(Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.LIST.COMPONENTS.BUTTONS.DELETE.LABEL)
              .setStyle(ButtonStyles.DANGER)
              .setEmoji(parseEmoji(Emojis.TRASH))
              .toJSON(),
          ],
        };
      },
    );

    return await pagination(context, {
      data: await Promise.all(availableAutomationsPages),
      locale,
      timeBeforeExpiration: 60000,
    });
  },
});
