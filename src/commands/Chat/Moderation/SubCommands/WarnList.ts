import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors, Emojis } from "#constants";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { pagination } from "#util/Pagination";
import { prisma } from "#util/Prisma.js";
import { UnixType, errorMessage, formatUnix, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "warn_list",
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

    const _userOption = _context.data.options.getUser("user") ?? _context.user;
    const userWarns = await prisma.userWarn.findMany({
      where: {
        guildID: _context.guild.id,
        general: {
          is: {
            userID: _userOption.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!userWarns.length) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.WARN.LIST.WARNINGS_NOT_FOUND({
          user: _userOption.mention,
        }),
      });
    }

    pagination(
      { _context, locale, ephemeral: false },
      userWarns.map((warning) => {
        return new Embed()
          .setTitle(
            Translations[locale].COMMANDS.MODERATION.WARN.LIST.MESSAGE_1.TITLE_1({
              user: sanitizeString(_userOption.globalName ?? _userOption.username, {
                maxLength: 50,
                espaceMarkdown: true,
              }),
            }),
          )
          .setThumbnail(_userOption.avatarURL())
          .addFields([
            {
              name: Translations[locale].COMMANDS.MODERATION.WARN.LIST.MESSAGE_1.FIELD_1.FIELD({
                warning: warning.general.warningID,
              }),
              value: Translations[locale].COMMANDS.MODERATION.WARN.LIST.MESSAGE_1.FIELD_1.VALUE({
                moderator:
                  _context.guild.members.get(warning.general.moderatorID)?.mention ?? Emojis.CANCEL_CIRCLE_COLOR,
                reason: warning.general.reason,
              }),
            },
            {
              name: Translations[locale].COMMANDS.MODERATION.WARN.LIST.MESSAGE_1.FIELD_2.FIELD,
              value: `${Emojis.EXPAND_CIRCLE_RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, warning.createdAt)}`,
            },
          ])
          .setColor(Colors.COLOR)
          .toJSON();
      }),
    );
  },
});
