import { DiscordSnowflake } from "@sapphire/snowflake";
import { gzip } from "pako";
import { YAMLCord } from "yamlcord";
import { createChatInputSubCommand } from "#util/Handlers.js";
import { prisma } from "#util/Prisma.js";

const yamlCord = new YAMLCord();

export default createChatInputSubCommand({
  name: "automations_create",
  run: async ({ context }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) return;

    const attachment = context.data.options.getAttachment("code", true);
    const attachmentContentRequest = await fetch(attachment.url, {
      method: "GET",
      headers: {
        authorization: `Bot ${process.env.CLIENT_TOKEN}`,
      },
    });
    const attachmentContent = await attachmentContentRequest.text();

    yamlCord
      .createSequencesFromData(attachmentContent)
      .then(async () => {
        const contentToBuffer = Buffer.from(attachmentContent, "utf-8");
        const compressedBuffer = gzip(contentToBuffer);

        await prisma.guildAutomation.create({
          data: {
            automationId: DiscordSnowflake.generate().toString(),
            createdAt: new Date(),
            general: {
              data: Buffer.from(compressedBuffer),
              trigger: "ON_MESSAGE_CREATE",
            },
            guildId: context.guildID,
          },
        });
      })
      .catch(() => {});
  },
});
