import { Embed, EmbedField } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors, Emojis } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { FetchFrom, UnixType, errorMessage, fetchUser, formatUnix, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "server",
  directory: Directories.INFORMATION,
  run: async (context: CommandInteraction, { locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: context,
        }),
      });
    }

    const owner = context.guild.owner ?? (await fetchUser(FetchFrom.DEFAULT, context.guild.ownerID ?? ""));

    await context.reply({
      embeds: new Embed()
        /*.setTitle(
          Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.TITL({
            name: sanitizeString(context.guild.name, {
              maxLength: 50,
              espaceMarkdown: true,
            }),
          }),
        )*/
        .setThumbnail(context.guild.iconURL() ?? client.user.avatarURL())
        .addFields([
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_1.FIELD).setValue(
            Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_1.VALUE({
              name: sanitizeString(context.guild.name, {
                maxLength: 50,
                espaceMarkdown: true,
              }),
              id: context.guildID,
              owner: owner?.mention ?? Emojis.CIRCLE_X_COLOR,
            }),
          ),
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_2.FIELD).setValue(
            Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_2.VALUE({
              members: context.guild.memberCount,
              channels: context.guild.channels.size,
              roles: context.guild.roles.size,
            }),
          ),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_3.FIELD)
            .setValue(
              `${Emojis.CIRCLE_CHEVRON_RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, context.guild.createdAt)}`,
            ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
