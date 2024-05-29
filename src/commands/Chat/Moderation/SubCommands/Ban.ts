import { cutText } from "@sapphire/utilities";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { errorMessage, escapeDiscordMarkdown, handleError } from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "ban",
  permissions: {
    user: ["BAN_MEMBERS"],
    bot: ["BAN_MEMBERS"],
  },
  directory: Directory.MODERATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
            structure: _context,
          }),
        },
      );
    }

    const _memberOption = _context.data.options.getMember("user", true);
    const _reasonOption = cutText(
      escapeDiscordMarkdown(
        _context.data.options.getString("reason") ?? "No reason",
      ),
      35,
    );
    const _deleteMessagesOption =
      _context.data.options.getNumber("delete_messages") ?? 0;

    if (
      _memberOption.id === _client.user.id ||
      _memberOption.id === _context.guild.ownerID ||
      _memberOption.id === _context.user.id
    ) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].GLOBAL.CANNOT_MODERATE_MEMBER,
        },
      );
    }

    await _client.rest.guilds
      .createBan(_context.guildID, _memberOption.id, {
        deleteMessageSeconds: _deleteMessagesOption,
        reason: _reasonOption,
      })
      .then(() => {
        _context.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              Translations[locale].COMMANDS.MODERATION.BAN.MESSAGE_1({
                user: _memberOption.mention,
                moderator: _context.user.mention,
              }),
            )
            .setColor(Colors.SUCCESS)
            .toJSONArray(),
        });
      })
      .catch(async (error) => {
        await handleError(
          {
            _context,
            locale,
          },
          error,
        );
      });
  },
});
