import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "#builders";
import { BaseBuilder } from "#builders";
import type { Discord } from "#classes";
import { Colors } from "#constants";
import { Translations } from "#locales";
import {
  type ChatInputSubCommandInterface,
  Directory,
  type Locales,
} from "#types";
import { errorMessage } from "#util";
import { prisma } from "#util/Prisma";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "language",
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

    const _languageOption = _context.data.options.getString("language", true);
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
          locale: _languageOption,
        },
      },
      create: {
        guild_id: _context.guildID,
        general: {
          locale: _languageOption,
        },
        premium: {},
      },
    });

    await _context.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[<Locales>upsertedGuildConfiguration.general.locale]
            .COMMANDS.CONFIG.LANGUAGE.MESSAGE_1,
        )
        .setColor(Colors.SUCCESS)
        .toJSONArray(),
    });
  },
});
