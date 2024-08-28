import { bold, inlineCode } from "@discordjs/formatters";
import { ActionRow, Button, Embed } from "oceanic-builders";
import { ButtonStyles } from "oceanic.js";
import { Colors, Emojis } from "#constants";
import { client } from "#index";
import { createPrefixCommand } from "#util/Handlers";
import { errorMessage, parseEmoji } from "#util/Util";

export default createPrefixCommand({
  developerOnly: true,
  name: "lookup-guild",
  run: async ({ args, context }) => {
    const guildId = args[0].trim();

    if (!guildId) {
      return await errorMessage(bold(`${Emojis.CANCEL} You need to enter a server ID`), {
        context,
      });
    }

    const guild = client.guilds.get(guildId);

    if (!guild) {
      return await errorMessage(bold(`${Emojis.CANCEL} The guild ${inlineCode(guildId)} has not been found`), {
        context,
      });
    }

    return await client.rest.channels.createMessage(context.channelID, {
      embeds: new Embed()
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL() ?? client.user.avatarURL(),
        })
        .setColor(Colors.COLOR)
        .toJSON(true),
      components: new ActionRow()
        .addComponents([
          new Button()
            .setCustomID("@lookup_guild/owner")
            .setLabel("Owner")
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji(parseEmoji(Emojis.SHIELD_PERSON)),
          new Button()
            .setCustomID(`@lookup_guild/invite#${guild.id}`)
            .setLabel("Generate Invitation")
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji(parseEmoji(Emojis.LINK)),
          new Button()
            .setCustomID(`@lookup_guild/leave#${guild.id}`)
            .setLabel("Leave")
            .setStyle(ButtonStyles.DANGER)
            .setEmoji(parseEmoji(Emojis.EXIT_TO_APP)),
        ])
        .toJSON(true),
    });
  },
});
