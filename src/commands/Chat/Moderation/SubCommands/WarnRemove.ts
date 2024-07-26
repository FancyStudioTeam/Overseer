import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { prisma } from "#util/Prisma.js";
import { ComparationLevel, compareMemberToMember, errorMessage, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "warn_remove",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  directory: Directories.MODERATION,
  run: async (context: CommandInteraction, { locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: context,
        }),
      });
    }

    const _memberOption = context.data.options.getMember("user");
    const _warningOption = sanitizeString(context.data.options.getString("warning", true), {
      espaceMarkdown: true,
    });
    const _reasonOption = sanitizeString(context.data.options.getString("reason") ?? "No reason", {
      maxLength: 50,
      espaceMarkdown: true,
    });

    if (!_memberOption) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
      });
    }

    if (
      _memberOption.id === client.user.id ||
      _memberOption.id === context.guild.ownerID ||
      _memberOption.id === context.user.id
    ) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.CANNOT_MODERATE_MEMBER,
      });
    }

    if (compareMemberToMember(context.guild.clientMember, _memberOption) !== ComparationLevel.HIGHER) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.HIERARCHY.CLIENT,
      });
    }

    if (
      context.user.id !== context.guild.ownerID &&
      compareMemberToMember(context.member, _memberOption) !== ComparationLevel.HIGHER
    ) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.HIERARCHY.USER,
      });
    }

    const userWarn = await prisma.userWarn.findFirst({
      where: {
        guildID: context.guild.id,
        general: {
          is: {
            warningID: _warningOption,
            userID: _memberOption.id,
          },
        },
      },
    });

    if (!userWarn) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.WARN.REMOVE.WARNING_NOT_FOUND({ id: _warningOption }),
      });
    }

    await prisma.userWarn.delete({
      where: {
        id: userWarn.id,
        general: {
          is: {
            warningID: userWarn.general.warningID,
          },
        },
      },
    });

    await context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.WARN.REMOVE.MESSAGE_1({
            moderator: context.user.mention,
            user: _memberOption.mention,
            reason: _reasonOption,
          }),
        )
        .setColor(Colors.RED)
        .toJSON(true),
    });
  },
});
