import { Colors, Emojis } from "@constants";
import { Translations } from "@translations";
import { createPrefixCommand } from "@util/Handlers";
import { createErrorMessage, createMessage, parseEmoji } from "@utils";
import {
  ActionRowBuilder,
  DangerButtonBuilder,
  EmbedBuilder,
  EmbedFieldBuilder,
  SecondaryButtonBuilder,
} from "oceanic-builders";

export default createPrefixCommand({
  developerOnly: true,
  name: "lookup-guild",
  run: async ({ args, client, context, locale }) => {
    const guildId = args[0];

    if (!guildId) {
      return await client.rest.channels.createReaction(context.channelID, context.id, Emojis.CANCEL_COLORED);
    }

    const guild = client.guilds.get(guildId.trim());

    if (!guild) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.GUILD_NOT_FOUND({
          guildId,
        }),
      );
    }

    return createMessage(context, {
      components: new ActionRowBuilder()
        .addComponents([
          new SecondaryButtonBuilder()
            .setCustomID(`@lookup_guild/owner#${guild.id}`)
            .setLabel(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.OWNER.LABEL)
            .setEmoji(parseEmoji(Emojis.SHIELD_PERSON)),
          new SecondaryButtonBuilder()
            .setCustomID(`@lookup_guild/invite#${guild.id}`)
            .setLabel(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.INVITE.LABEL)
            .setEmoji(parseEmoji(Emojis.LINK)),
          new DangerButtonBuilder()
            .setCustomID(`@lookup_guild/leave#${guild.id}`)
            .setLabel(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.LEAVE.LABEL)
            .setEmoji(parseEmoji(Emojis.LOGOUT_COLORED)),
        ])
        .toJSON(true),
      embeds: new EmbedBuilder()
        .setTitle(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.TITLE_1)
        .addFields([
          new EmbedFieldBuilder()
            .setName(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_1.NAME)
            .setValue(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_1.VALUE({
                guildId: guild.id,
                guildName: guild.name,
              }),
            ),
          new EmbedFieldBuilder()
            .setName(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_2.NAME)
            .setValue(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_2.VALUE({
                channelCount: guild.channels.size,
                memberCount: guild.memberCount,
              }),
            ),
          new EmbedFieldBuilder()
            .setName(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_3.NAME)
            .setValue(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_3.VALUE({
                createdAt: guild.createdAt,
              }),
            ),
          new EmbedFieldBuilder()
            .setName(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_4.NAME)
            .setValue(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_4.VALUE({
                joinedAt: new Date(String(guild.clientMember.joinedAt)),
              }),
            ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
