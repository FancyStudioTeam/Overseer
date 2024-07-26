import { DiscordSnowflake } from "@sapphire/snowflake";
import { Embed } from "oceanic-builders";
import { Base } from "#base";
import { Colors } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { prisma } from "#util/Prisma.js";
import { ComparationLevel, compareMemberToMember, errorMessage, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "warn_add",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  directory: Directories.MODERATION,
  run: async ({ context, locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: context,
        }),
      });
    }

    const memberOption = context.data.options.getMember("user");
    const reasonOption = sanitizeString(context.data.options.getString("reason") ?? "No reason", {
      maxLength: 50,
      espaceMarkdown: true,
    });

    if (!memberOption) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
      });
    }

    if (
      memberOption.id === client.user.id ||
      memberOption.id === context.guild.ownerID ||
      memberOption.id === context.user.id
    ) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.CANNOT_MODERATE_MEMBER,
      });
    }

    if (compareMemberToMember(context.guild.clientMember, memberOption) !== ComparationLevel.HIGHER) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.HIERARCHY.CLIENT,
      });
    }

    if (
      context.user.id !== context.guild.ownerID &&
      compareMemberToMember(context.member, memberOption) !== ComparationLevel.HIGHER
    ) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.HIERARCHY.USER,
      });
    }

    const userWarns = await prisma.userWarn.findMany({
      where: {
        guildID: context.guild.id,
        general: {
          is: {
            userID: memberOption.id,
          },
        },
      },
    });

    if (userWarns.length >= 10) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.WARN.ADD.MAX_WARNINGS_ALLOWED,
      });
    }

    await prisma.userWarn.create({
      data: {
        guildID: context.guild.id,
        general: {
          userID: memberOption.id,
          warningID: DiscordSnowflake.generate().toString(),
          moderatorID: context.user.id,
          reason: reasonOption,
        },
      },
    });

    await context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.WARN.ADD.MESSAGE_1({
            moderator: context.user.mention,
            user: memberOption.mention,
            reason: reasonOption,
          }),
        )
        .setColor(Colors.GREEN)
        .toJSON(true),
    });
  },
});
