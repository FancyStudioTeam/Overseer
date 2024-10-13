import { Colors } from "@constants";
import type { GuildAutomationTrigger } from "@prisma/client";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers.js";
import { createErrorMessage } from "@util/utils";
import { Embed } from "oceanic-builders";
import { gzip } from "pako";
import { YAMLCord } from "yamlcord";

const MAXIMUM_AUTOMATIONS_PER_GUILD = (isPremium: boolean) => (isPremium ? 10 : 5);
const MAXIMUM_KILOBYTES = (isPremium: boolean) => (isPremium ? 10 : 5);
const parseScript = async (script: string) =>
  await new YAMLCord()
    .createSequencesFromData(script)
    .then(() => ({
      success: true,
      parserError: null,
    }))
    .catch((error) => ({
      success: false,
      parserError: String(`[${error.code}] ${error.message}`),
    }));

export default createChatInputSubCommand({
  category: CommandCategory.CONFIGURATION,
  name: "automations_create",
  run: async ({ client, context, locale, isPremium }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) return;

    const nameOption = context.data.options.getString("name", true);
    const scriptOption = context.data.options.getAttachment("script", true);
    const triggerOption = context.data.options.getString<GuildAutomationTrigger>("trigger", true);
    const attachmentContentRequest = await fetch(scriptOption.url, {
      headers: {
        authorization: String(client.options.auth),
      },
      method: "GET",
    });
    const attachmentContent = await attachmentContentRequest.text();
    const { success, parserError } = await parseScript(attachmentContent);

    if (!success) {
      return await createErrorMessage(context, {
        content: Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.CREATE.ERROR_WHILE_PARSING({
          errorMessage: String(parserError),
        }),
      });
    }

    const bufferSizeInKilobytes = Buffer.from(attachmentContent).length / 1024;

    if (bufferSizeInKilobytes >= MAXIMUM_KILOBYTES(isPremium)) {
      return await createErrorMessage(context, {
        content: Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.CREATE.MAXIMUM_SIZE_ALLOWED({
          maximum: MAXIMUM_KILOBYTES(isPremium),
        }),
      });
    }

    const guildAutomations = await client.prisma.guildAutomation.findMany({
      where: {
        guildId: context.guildID,
      },
    });

    if (guildAutomations.length >= MAXIMUM_AUTOMATIONS_PER_GUILD(isPremium)) {
      return await createErrorMessage(context, {
        content: Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.CREATE.MAXIMUM_AUTOMATIONS_ALLOWED({
          maximum: MAXIMUM_AUTOMATIONS_PER_GUILD(isPremium),
        }),
      });
    }

    const automationId = DiscordSnowflake.generate().toString();
    const compressedBuffer = Buffer.from(gzip(Buffer.from(attachmentContent)));
    const {
      general: { name: automationName },
    } = await client.prisma.guildAutomation.create({
      data: {
        automationId,
        general: {
          data: compressedBuffer,
          name: nameOption,
          trigger: triggerOption,
        },
        guildId: context.guildID,
      },
      select: {
        general: true,
      },
    });

    return await context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.CONFIGURATION.AUTOMATIONS.CREATE.MESSAGE_1({
            automationName,
          }),
        )
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
