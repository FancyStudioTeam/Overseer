import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#classes";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { errorMessage } from "#util";
import { prisma } from "#util/Prisma";
import timezones from "#util/Timezones";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "timezone",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  directory: Directory.CONFIGURATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
            structure: _context,
          }),
        },
      );
    }

    const _timezoneOption = _context.data.options.getString("timezone", true);
    const _12HoursOption = _context.data.options.getBoolean("12-hours", true);

    if (!timezones.includes(_timezoneOption)) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[
            locale
          ].COMMANDS.CONFIG.TIMEZONE.ERRORS.TIMEZONE_NOT_FOUND({
            timezone: _timezoneOption,
          }),
        },
      );
    }

    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: _context.guildID,
      },
      select: {
        general: true,
      },
    });
    const upsertedGuildConfiguration = await prisma.guildConfiguration.upsert({
      where: {
        guild_id: _context.guildID,
      },
      update: {
        general: {
          ...guildConfiguration?.general,
          timezone: _timezoneOption,
          use_12_hours: _12HoursOption,
        },
      },
      create: {
        guild_id: _context.guildID,
        general: {
          timezone: _timezoneOption,
          use_12_hours: _12HoursOption,
        },
        premium: {},
      },
    });

    await _context.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.CONFIG.TIMEZONE.MESSAGE_1({
            timezone: upsertedGuildConfiguration.general.timezone,
          }),
        )
        .setColor(Colors.SUCCESS)
        .toJSONArray(),
    });
  },
});
