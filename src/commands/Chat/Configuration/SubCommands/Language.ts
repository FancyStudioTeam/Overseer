import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "#builders";
import { BaseBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { prisma } from "#prisma";
import { type ChatInputSubCommandInterface, Directory, type Locales } from "#types";
import { errorMessage } from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "language",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  directory: Directory.CONFIGURATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: _context,
        }),
      });
    }

    const _languageOption = _context.data.options.getString("language", true);
    const upsertedGuildConfiguration = await prisma.guildConfiguration.upsert({
      where: {
        guild_id: _context.guildID,
      },
      update: {
        general: {
          update: {
            locale: _languageOption,
          },
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
        .setDescription(Translations[<Locales>upsertedGuildConfiguration.general.locale].COMMANDS.CONFIGURATION.LANGUAGE.MESSAGE_1)
        .setColor(Colors.SUCCESS)
        .toJSONArray(),
    });
  },
});
