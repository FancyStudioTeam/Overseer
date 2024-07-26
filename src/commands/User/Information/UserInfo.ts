import { Embed, EmbedField } from "oceanic-builders";
import { ApplicationCommandTypes } from "oceanic.js";
import { Base } from "#base";
import { Colors, Emojis } from "#constants";
import { Translations } from "#translations";
import type { UserCommand } from "#types";
import { FetchFrom, UnixType, errorMessage, fetchMember, formatUnix, sanitizeString } from "#util/Util.js";

export default new Base<UserCommand>({
  name: "User Info",
  type: ApplicationCommandTypes.USER,
  run: async ({ context, locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: context,
        }),
      });
    }

    const member = await fetchMember(FetchFrom.DEFAULT, context.guild, context.data.targetID ?? context.user.id);

    if (!member) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
      });
    }

    await context.reply({
      embeds: new Embed()
        .setTitle(
          Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.TITLE_1({
            name: sanitizeString(member.user.globalName ?? member.user.username, {
              maxLength: 50,
              espaceMarkdown: true,
            }),
          }),
        )
        .setThumbnail(member.user.avatarURL())
        .addFields([
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_1.FIELD).setValue(
            Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_1.VALUE({
              name: member.user.mention,
              id: member.user.id,
            }),
          ),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_2.FIELD)
            .setValue(`${Emojis.CIRCLE_CHEVRON_RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, member.user.createdAt)}`),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_3.FIELD)
            .setValue(
              `${Emojis.CIRCLE_CHEVRON_RIGHT} ${member.joinedAt ? formatUnix(UnixType.SHORT_DATE_TIME, member.joinedAt) : Emojis.CIRCLE_X_COLOR}`,
            ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
