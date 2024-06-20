import { DiscordSnowflake } from "@sapphire/snowflake";
import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import { _client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { prisma } from "#util/Prisma.js";
import { ComparationLevel, compareMemberToMember, errorMessage, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "warn_add",
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

    const _memberOption = _context.data.options.getMember("user", true);
    const _reasonOption = sanitizeString(_context.data.options.getString("reason") ?? "No reason", {
      maxLength: 50,
      espaceMarkdown: true,
    });

    if (!_memberOption) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
      });
    }

    if (
      _memberOption.id === _client.user.id ||
      _memberOption.id === _context.guild.ownerID ||
      _memberOption.id === _context.user.id
    ) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.CANNOT_MODERATE_MEMBER,
      });
    }

    if (compareMemberToMember(_context.guild.clientMember, _memberOption) !== ComparationLevel.HIGHER) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.HIERARCHY.CLIENT,
      });
    }

    if (
      _context.user.id !== _context.guild.ownerID &&
      compareMemberToMember(_context.member, _memberOption) !== ComparationLevel.HIGHER
    ) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.HIERARCHY.USER,
      });
    }

    const userWarns = await prisma.userWarn.findMany({
      where: {
        guildID: _context.guild.id,
        general: {
          userID: _memberOption.id,
        },
      },
    });

    console.log("User Warns:", userWarns); // Aquí se agrega el console log

    if (userWarns.length >= 10) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.WARN.ADD.MAX_WARNINGS,
      });
    }

    await prisma.userWarn.create({
      data: {
        guildID: _context.guild.id,
        general: {
          userID: _memberOption.id,
          warningID: DiscordSnowflake.generate().toString(), // Genera un nuevo warningID
          moderatorID: _context.user.id,
          reason: _reasonOption,
        },
      },
    });

    await _context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.WARN.ADD.MESSAGE_1({
            user: _memberOption.mention,
            moderator: _context.user.mention,
            reason: _reasonOption,
          }).join(" "),
        )
        .setColor(Colors.GREEN)
        .toJSONArray(),
    });
  },
});
