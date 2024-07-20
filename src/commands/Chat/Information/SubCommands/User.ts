import { Embed, EmbedField } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors, Emojis } from "#constants";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { FetchFrom, UnixType, errorMessage, fetchMember, formatUnix, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "user",
  directory: Directories.INFORMATION,
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

    const member = await fetchMember(
      FetchFrom.DEFAULT,
      _context.guild,
      _context.data.options.getMember("user")?.id ?? _context.user.id,
    );

    if (!member) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
      });
    }

    await _context.reply({
      embeds: new Embed()
        .setTitle(
          Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.TITLE_1({
            name: sanitizeString(member.user.globalName ?? member.user.username, {
              maxLength: 50,
              espaceMarkdown: true,
            }),
          }),
        )
        .setThumbnail(member.user.avatarURL())
        .addFields([
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_1.FIELD).setValue(
            Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_1.VALUE({
              name: member.user.mention,
              id: member.user.id,
            }),
          ),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_2.FIELD)
            .setValue(`${Emojis.EXPAND_CIRCLE_RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, member.user.createdAt)}`),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_3.FIELD)
            .setValue(
              `${Emojis.EXPAND_CIRCLE_RIGHT} ${member.joinedAt ? formatUnix(UnixType.SHORT_DATE_TIME, member.joinedAt) : Emojis.CANCEL_CIRCLE_COLOR}`,
            ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});

/*function userFlagsArray({ locale, user }: { locale: Locales; user: User }): string[] {
  const resolvedFlags = bitFieldValues(user.publicFlags);
  const flags: string[] = [];
  const emojis: Record<number, string> = {
    1: UserFlagsEmojis.DISCORD_STAFF,
    2: UserFlagsEmojis.PARTENERED_SERVER_OWNER,
    4: UserFlagsEmojis.HYPE_SQUAD_EVENTS,
    8: UserFlagsEmojis.DISCORD_BUG_HUNTER_TIER_1,
    64: UserFlagsEmojis.HYPE_SQUAD_BRAVERY,
    128: UserFlagsEmojis.HYPE_SQUAD_BRILLIANCE,
    256: UserFlagsEmojis.HYPE_SQUAD_BALANCE,
    512: UserFlagsEmojis.EARLY_SUPPORTER,
    1024: Emojis.GROUP,
    16384: UserFlagsEmojis.DISCORD_BUG_HUNTER_TIER_2,
    65536: UserFlagsEmojis.VERIFIED_APP,
    131072: UserFlagsEmojis.EARLY_VERIFIED_BOT_DEVELOPER,
    262144: UserFlagsEmojis.MODERATOR_PROGRAMS_ALUMNI,
    524288: Emojis.HTTP,
    4194304: UserFlagsEmojis.ACTIVE_DEVELOPER,
  };

  for (const flag of resolvedFlags) {
    if (emojis[flag]) {
      flags.push(`${emojis[flag]} **${Translations[locale].USER_FLAGS[<UserFlags>flag]}**`);
    }
  }

  return flags;
}*/
