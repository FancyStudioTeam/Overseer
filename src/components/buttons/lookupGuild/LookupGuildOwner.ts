import { Colors, Emojis } from "@constants";
import { bold, inlineCode } from "@discordjs/formatters";
import { client } from "@index";
import { createComponent } from "@util/Handlers";
import { UnixType, createErrorMessage, formatUnix } from "@utils";
import { Embed, EmbedField } from "oceanic-builders";
import { ComponentTypes } from "oceanic.js";

export default createComponent({
  developerOnly: true,
  name: "@lookup_guild/owner",
  type: ComponentTypes.BUTTON,
  run: async ({ context, variable }) => {
    const guildId = String(variable);
    const guild = client.guilds.get(guildId);

    if (!guild) {
      return await createErrorMessage(context, {
        content: bold(`${Emojis.CANCEL} The guild ${inlineCode(guildId)} has not been found`),
      });
    }

    const owner = guild.owner ?? (await client.rest.guilds.getMember(guild.id, guild.ownerID ?? ""));

    if (!owner) {
      return await createErrorMessage(context, {
        content: bold(`${Emojis.CANCEL} Unable to obtain the server owner`),
      });
    }

    return await context.reply({
      embeds: new Embed()
        .setAuthor({
          name: owner.username,
          iconURL: owner.avatarURL(),
        })
        .addFields([
          new EmbedField()
            .setName(bold("General Information"))
            .setValue(
              [
                `${bold(`${Emojis.ARROW_CIRCLE_RIGHT} User Mention`)}: ${owner.mention}`,
                `${bold(`${Emojis.ARROW_CIRCLE_RIGHT} User ID`)}: ${owner.id}`,
              ].join("\n"),
            ),
          new EmbedField().setName(bold("Date of Creation")).setValue(
            `${Emojis.ARROW_CIRCLE_RIGHT} ${formatUnix(owner.createdAt, {
              type: UnixType.SHORT_DATE_TIME,
            })}`,
          ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
