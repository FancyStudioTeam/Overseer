import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory, type Locales } from "#types";
import { errorMessage, handleError } from "#util";
import { cutText } from "@sapphire/utilities";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "kick",
  permissions: {
    user: ["KICK_MEMBERS"],
    bot: ["KICK_MEMBERS"],
  },
  directory: Directory.MODERATION,
  run: async (
    _client: Discord,
    _context: CommandInteraction,
    { locale },
  ) => {
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
        }
      );
    }

    const _memberOption = _context.data.options.getUser("user");
    const _reasonOption = cutText(
      _context.data.options.getString("reason", true) ?? "No reason",
      35
    );

    if (!_memberOption) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].COMMANDS.MOD.KICK.INVALID_GUILD_MEMBER,
        }
      );
    }

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
          description: Translations[locale].COMMANDS.MOD.KICK.CANNOT_MODERATE_MEMBER,
        }
      );
    }

    await _client.rest.guilds
      .removeMember(_context.guild.id, _memberOption.id, _reasonOption)
      .then(async () => {
        await _context.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              Translations[locale].COMMANDS.MOD.KICK.MESSAGE_1({
                user: _memberOption.mention,
                moderator: _context.user.mention,
              })
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
          error
        );
      });
  },
});
