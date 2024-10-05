import type { Prisma } from "@prisma/client";
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

    const attachmentOption = context.data.options.getAttachment("code", true);
    const triggerOption = context.data.options.getString(
      "trigger",
      true,
    ) as (typeof Prisma.GuildAutomationGeneral)["trigger"];
    const attachmentContentRequest = await fetch(attachmentOption.url, {
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
              trigger: triggerOption,
            },
            guildId: context.guildID,
          },
        });
      })
      .catch(() => {});
  },
});
