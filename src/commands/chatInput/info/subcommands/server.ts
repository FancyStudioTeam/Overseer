import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { Colors, Emojis } from "../../../../constants";
import { Translations } from "../../../../locales";
import { UnixType } from "../../../../types";
import { errorMessage, fetchUser, formatUnix } from "../../../../util/util";

export default new SubCommand({
  name: "server",
  run: async (
    _client: Fancycord,
    _interaction: CommandInteraction,
    { locale }
  ) => {
    if (!_interaction.inCachedGuildChannel() || !_interaction.guild) {
      return await errorMessage(_interaction, true, {
        description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: _interaction,
        }),
      });
    }

    const owner =
      _interaction.guild.owner ??
      (await fetchUser(_interaction.guild.ownerID ?? ""));

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.AUTHOR_1({
            name: _interaction.guild.name,
          }),
        })
        .setThumbnail(_interaction.guild.iconURL() ?? _client.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_1
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_1.VALUE({
              name: _interaction.guild.name,
              id: _interaction.guild.id,
              owner: owner?.mention ?? Emojis.MARK,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_2
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_2.VALUE({
              members: _interaction.guild.memberCount,
              channels: _interaction.guild.channels.size,
              roles: _interaction.guild.roles.size,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_3
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_3.VALUE({
              date: formatUnix(
                UnixType.SHORT_DATE_TIME,
                _interaction.guild.createdAt
              ),
            }),
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
