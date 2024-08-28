import { bold } from "@discordjs/formatters";
import { Embed } from "oceanic-builders";
import { ChannelTypes, ComponentTypes, MessageFlags } from "oceanic.js";
import { Colors, Emojis } from "#constants";
import { client } from "#index";
import { createComponent } from "#util/Handlers";
import { errorMessage } from "#util/Util";

export default createComponent({
  developerOnly: true,
  name: "@lookup_guild/invite",
  type: ComponentTypes.BUTTON,
  run: async ({ context, variable }) => {
    const guildId = String(variable);
    const guild = client.guilds.get(guildId);

    if (!guild) {
      return await errorMessage(`**${Emojis.CANCEL} The guild \`${guildId}\` has not been found**`, {
        context,
      });
    }

    let channelId = null;

    for (const channel of guild.channels.values()) {
      if (channel.type !== ChannelTypes.GUILD_TEXT) continue;
      if (!channel.permissionsOf(guild.clientMember).has("CREATE_INSTANT_INVITE")) continue;

      channelId = channel.id;

      break;
    }

    if (!channelId) {
      return await errorMessage(bold(`${Emojis.CANCEL} No valid channel ID found`), {
        context,
      });
    }

    const invite = await client.rest.channels.createInvite(channelId, {
      maxUses: 1,
    });

    return await context.reply({
      embeds: new Embed()
        .setDescription(`**${Emojis.ARROW_CIRCLE_RIGHT} ||https://discord.gg/${invite.code}||**`)
        .setColor(Colors.COLOR)
        .toJSON(true),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
