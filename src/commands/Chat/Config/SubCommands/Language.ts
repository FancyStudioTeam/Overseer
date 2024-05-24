import type { CommandInteraction } from "oceanic.js";
import { Colors } from "../../../../Constants";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Translations } from "../../../../locales";
import type { Locales } from "../../../../types";
import { prisma } from "../../../../util/Prisma";
import { errorMessage, handleError } from "../../../../util/Util";

export default new SubCommand({
  name: "language",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    _client: Discord,
    _interaction: CommandInteraction,
    { locale },
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
        },
      );
    }

    const _languageOption = _interaction.data.options.getString(
      "language",
      true,
    );
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
            locale: _languageOption,
          },
        },
        create: {
          guild_id: _interaction.guild.id,
          general: {
            locale: _languageOption,
          },
          premium: {},
        },
      })
      .then(async (updatedData) => {
        await _interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              Translations[<Locales>updatedData.general.locale].COMMANDS.CONFIG
                .LANGUAGE.MESSAGE_1,
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
          error,
        );
      });
  },
});
