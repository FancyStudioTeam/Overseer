import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder } from "#base";
import { Colors } from "#constants";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { errorMessage } from "#util/Util.js";

export default new BaseBuilder<ChatInputSubCommand>({
  name: "purge",
  permissions: {
    user: ["MANAGE_MESSAGES"],
    bot: ["MANAGE_MESSAGES"],
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

    const _amountOption = _context.data.options.getInteger("amount");

    if (!_amountOption || Number.isNaN(_amountOption) || _amountOption < 1 || _amountOption > 100) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.PURGE.INVALID_AMOUNT,
      });
    }

    const adjustedAmount = _amountOption + 1;
    const messagesToDelete = await _context.channel.getMessages({ limit: adjustedAmount });

    if (messagesToDelete.length <= 1) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.PURGE.NO_MESSAGES,
      });
    }

    messagesToDelete.shift();

    await _context.channel.deleteMessages(messagesToDelete.map((msg) => msg.id));

    await _context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.PURGE.SUCCESS_MESSAGE({
            count: _amountOption,
          }),
        )
        .setColor(Colors.GREEN)
        .toJSONArray(),
    });
  },
});
