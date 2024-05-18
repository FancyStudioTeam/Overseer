import type { CommandInteraction } from "oceanic.js";
import { Colors } from "../../../../Constants";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Translations } from "../../../../locales";
import { prisma } from "../../../../util/Prisma";
import timezones from "../../../../util/Timezones";
import { errorMessage, handleError } from "../../../../util/Util";

export default new SubCommand({
  name: "timezone",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    _client: Discord,
    _interaction: CommandInteraction,
    { locale }
  ) => {
    if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) {
      return await errorMessage(
        {
          _context: _interaction,
          ephemeral: true,
        },
        {
          description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
            structure: _interaction,
          }),
        }
      );
    }

    const _timezoneOption = _interaction.data.options.getString(
      "timezone",
      true
    );
    const _12HoursOption = _interaction.data.options.getBoolean(
      "12-hours",
      true
    );

    if (!timezones.includes(_timezoneOption)) {
      return await errorMessage(
        {
          _context: _interaction,
          ephemeral: true,
        },
        {
          description: Translations[
            locale
          ].COMMANDS.CONFIG.TIMEZONE.ERRORS.TIMEZONE_NOT_FOUND({
            timezone: _timezoneOption,
          }),
        }
      );
    }

    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: _interaction.guild.id,
      },
      select: {
        general: true,
      },
    });

    await prisma.guildConfiguration
      .upsert({
        where: {
          guild_id: _interaction.guild.id,
        },
        update: {
          general: {
            ...guildConfiguration?.general,
            timezone: _timezoneOption,
            use_12_hours: _12HoursOption,
          },
        },
        create: {
          guild_id: _interaction.guild.id,
          general: {
            timezone: _timezoneOption,
            use_12_hours: _12HoursOption,
          },
          premium: {},
        },
      })
      .then(async (updatedData) => {
        await _interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              Translations[locale].COMMANDS.CONFIG.TIMEZONE.MESSAGE_1({
                timezone: updatedData.general.timezone,
              })
            )
            .setColor(Colors.SUCCESS)
            .toJSONArray(),
        });
      })
      .catch(async (error) => {
        await handleError(
          {
            _context: _interaction,
            locale,
          },
          error
        );
      });
  },
});
