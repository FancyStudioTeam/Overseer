import ms from "ms";
import humanize from "humanize-duration";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { errorMessage, sanitizeString } from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "timeout",
  permissions: {
    user: ["MODERATE_MEMBERS"],
    bot: ["MODERATE_MEMBERS"],
  },
  directory: Directory.MODERATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      await errorMessage(
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
      return;
    }

    const _memberOption = _context.data.options.getMember("user", true);
    const _durationOption = _context.data.options.getString("duration", true);
    const _reasonOption = sanitizeString(
      _context.data.options.getString("reason") ?? "No reason",
      {
        maxLength: 35,
        espaceMarkdown: true,
      },
    );

    if (
      _memberOption.id === _client.user.id ||
      _memberOption.id === _context.guild.ownerID ||
      _memberOption.id === _context.user.id
    ) {
      await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].GLOBAL.CANNOT_MODERATE_MEMBER,
        },
      );
      return;
    }

    const parsedTime = ms(_durationOption);

    if (parsedTime === undefined) {
      await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description:
            Translations[locale].COMMANDS.MODERATION.TIMEOUT
              .INVALID_DURATION_TIME,
        },
      );
      return;
    }

    if (parsedTime < ms("0 seconds") || parsedTime > ms("28 days")) {
      await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description:
            Translations[locale].COMMANDS.MODERATION.TIMEOUT
              .ALLOWED_DURATION_VALUES,
        },
      );
      return;
    }

    await _client.rest.guilds.editMember(_context.guildID, _memberOption.id, {
      communicationDisabledUntil:
        parsedTime > ms("0 seconds")
          ? new Date(Date.now() + parsedTime).toISOString()
          : null,
      reason: _reasonOption,
    });

    await _context.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            Translations[locale].COMMANDS.MODERATION.TIMEOUT.MESSAGE_1({
              moderator: _context.user.mention,
              user: _context.user.mention,
              timeout: humanize(parsedTime, { language: locale }),
            }),
          )
          .setColor(Colors.SUCCESS)
          .toJSON(),
      ],
    });
  },
});
