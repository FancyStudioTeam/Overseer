import { Colors, Emojis } from "@constants";
import { bold, inlineCode } from "@discordjs/formatters";
import { client } from "@index";
import { createComponent } from "@util/Handlers";
import { createErrorMessage } from "@utils";
import { Embed } from "oceanic-builders";
import { ComponentTypes, MessageFlags } from "oceanic.js";

export default createComponent({
  developerOnly: true,
  name: "@lookup_guild/leave",
  type: ComponentTypes.BUTTON,
  run: async ({ context, variable }) => {
    const guildId = String(variable);
    const guild = client.guilds.get(guildId);

    if (!guild) {
      return await createErrorMessage(context, {
        content: bold(`${Emojis.CANCEL} The guild ${inlineCode(guildId)} has not been found`),
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
