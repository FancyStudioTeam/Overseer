import { EmbedBuilder } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder } from "#base";
import { Colors } from "#constants";
import { _client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { errorMessage, sanitizeString } from "#util/Util.js";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "unban",
  permissions: {
    user: ["BAN_MEMBERS"],
    bot: ["BAN_MEMBERS"],
  },
  directory: Directory.MODERATION,
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

    const _userOption = _context.data.options.getUser("user", true);
    const _reasonOption = sanitizeString(_context.data.options.getString("reason") ?? "No reason", {
      maxLength: 50,
      espaceMarkdown: true,
    });
    const bannedUser = await _client.rest.guilds.getBan(_context.guildID, _userOption.id).catch(() => undefined);

    if (!bannedUser) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.UNBAN.BAN_NOT_FOUND({
          ban: _userOption.id,
        }),
      });
    }

    await _client.rest.guilds.removeBan(_context.guildID, bannedUser.user.id, _reasonOption);

    await _context.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.UNBAN.MESSAGE_1({
            user: _userOption.mention,
            moderator: _context.user.mention,
            reason: _reasonOption,
          }),
        )
        .setColor(Colors.SUCCESS)
        .toJSONArray(),
    });
  },
});
