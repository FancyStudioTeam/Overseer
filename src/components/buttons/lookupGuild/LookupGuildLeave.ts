import { bold, inlineCode } from "@discordjs/formatters";
import { Embed } from "oceanic-builders";
import { ComponentTypes, MessageFlags } from "oceanic.js";
import { Colors, Emojis } from "#constants";
import { client } from "#index";
import { createComponent } from "#util/Handlers";
import { errorMessage } from "#util/Util";

export default createComponent({
  developerOnly: true,
  name: "@lookup_guild/leave",
  type: ComponentTypes.BUTTON,
  run: async ({ context, variable }) => {
    const guildId = String(variable);
    const guild = client.guilds.get(guildId);

    if (!guild) {
      return await errorMessage(bold(`${Emojis.CANCEL} The guild ${inlineCode(guildId)} has not been found`), {
        context,
      });
    }

    await client.rest.users.leaveGuild(guild.id);
    return await context.reply({
      embeds: new Embed()
        .setDescription(bold(`I have left the guild ${inlineCode(guild.name)}`))
        .setColor(Colors.GREEN)
        .toJSON(true),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
