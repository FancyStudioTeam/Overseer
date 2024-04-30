import type {
  AnyInteractionChannel,
  ApplicationCommandTypes,
  CommandInteraction,
  Uncached,
} from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Colors } from "../../../../constants";
import { Translations } from "../../../../locales";
import { prisma } from "../../../../util/db";
import timezones from "../../../../util/timezones";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "timezone",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.CHAT_INPUT
    >,
    { locale }
  ) => {
    if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) {
      return await errorMessage(_interaction, true, {
        description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: _interaction,
        }),
      });
    }

    const _timezoneOption = _interaction.data.options.getString(
      "timezone",
      true
    );
    const _12HoursOption = _interaction.data.options.getBoolean(
      "12-hours",
      true
    );
    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: _interaction.guild.id,
      },
    });

    if (!timezones.includes(_timezoneOption)) {
      return await errorMessage(_interaction, true, {
        description: Translations[
          locale
        ].COMMANDS.CONFIG.TIMEZONE.ERRORS.TIMEZONE_NOT_FOUND({
          timezone: _timezoneOption,
        }),
      });
    }

    guildConfiguration
      ? await prisma.guildConfiguration.update({
          where: {
            guild_id: _interaction.guild.id,
          },
          data: {
            timezone: _timezoneOption,
            hour12: _12HoursOption,
          },
        })
      : await prisma.guildConfiguration.create({
          data: {
            guild_id: _interaction.guild.id,
            timezone: _timezoneOption,
            hour12: _12HoursOption,
          },
        });

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.CONFIG.TIMEZONE.MESSAGE_1({
            timezone: _timezoneOption,
          })
        )
        .setColor(Colors.SUCCESS)
        .toJSONArray(),
    });
  },
});
