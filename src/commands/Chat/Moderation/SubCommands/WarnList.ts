import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { prisma } from "#util/Prisma.js";
import { errorMessage } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "warn_list",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  directory: Directories.MODERATION,
  run: async (_context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: _context,
        }),
      });
    }

    const _memberOption = _context.data.options.getMember("user");

    if (!_memberOption) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
      });
    }

    const userWarns = await prisma.userWarn.findMany({
      where: {
        guildID: _context.guild.id,
        general: {
          is: {
            userID: _memberOption.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (userWarns.length === 0) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.WARN.LIST.NO_WARNINGS_FOUND,
      });
    }

    const fields = userWarns.map((warn) => ({
      name: Translations[locale].COMMANDS.MODERATION.WARN.LIST.EMBED_FIELD_TITLE({
        warningID: warn.general.warningID,
      }),
      value: Translations[locale].COMMANDS.MODERATION.WARN.LIST.EMBED_FIELD_DESCRIPTION({
        reason: warn.general.reason,
        moderator: `<@${warn.general.moderatorID}>`,
        date: warn.createdAt.toLocaleString(),
      }),
      inline: false,
    }));

    const embed = new Embed()
      .setTitle(
        Translations[locale].COMMANDS.MODERATION.WARN.LIST.EMBED_TITLE({
          user: _memberOption.user.username,
        }),
      )
      .setColor(Colors.GREEN)
      .setThumbnail(_memberOption.user.avatarURL())
      .addFields(fields);

    await _context.reply({
      embeds: [embed.toJSON()],
    });
  },
});
