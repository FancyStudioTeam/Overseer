import { Colors, Emojis } from "@constants";
import { Translations } from "@translations";
import { createPrefixCommand } from "@util/Handlers";
import { createErrorMessage, createMessage, parseEmoji } from "@utils";
import { ActionRow, Button, Embed, EmbedField } from "oceanic-builders";
import { ButtonStyles } from "oceanic.js";

export default createPrefixCommand({
  developerOnly: true,
  name: "lookup-guild",
  run: async ({ args, client, context, locale }) => {
    const guildId = args[0];

    if (!guildId) {
      return await client.rest.channels.createReaction(context.channelID, context.id, Emojis.CANCEL);
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
      components: new ActionRow()
        .addComponents([
          new Button()
            .setCustomID(`@lookup_guild/owner#${guild.id}`)
            .setLabel(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.OWNER.LABEL)
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji(parseEmoji(Emojis.SHIELD_PERSON)),
          new Button()
            .setCustomID(`@lookup_guild/invite#${guild.id}`)
            .setLabel(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.INVITE.LABEL)
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji(parseEmoji(Emojis.LINK)),
          new Button()
            .setCustomID(`@lookup_guild/leave#${guild.id}`)
            .setLabel(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.LEAVE.LABEL)
            .setStyle(ButtonStyles.DANGER)
            .setEmoji(parseEmoji(Emojis.EXIT_TO_APP)),
        ])
        .toJSON(true),
      embeds: new Embed()
        .setTitle(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.TITLE_1)
        .addFields([
          new EmbedField()
            .setName(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_1.NAME)
            .setValue(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_1.VALUE({
                guildId: guild.id,
                guildName: guild.name,
              }),
            ),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_2.NAME)
            .setValue(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_2.VALUE({
                channelCount: guild.channels.size,
                memberCount: guild.memberCount,
              }),
            ),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_3.NAME)
            .setValue(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.MESSAGE_1.FIELD_3.VALUE({
                createdAt: guild.createdAt,
              }),
            ),
          new EmbedField()
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
