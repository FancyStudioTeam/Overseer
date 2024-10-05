import { Colors, Emojis } from "@constants";
import { bold, inlineCode, spoiler } from "@discordjs/formatters";
import { client } from "@index";
import type { MaybeNullish } from "@types";
import { createComponent } from "@util/Handlers";
import { errorMessage } from "@utils";
import { Embed } from "oceanic-builders";
import { ChannelTypes, ComponentTypes, MessageFlags } from "oceanic.js";

export default createComponent({
  developerOnly: true,
  name: "@lookup_guild/invite",
  type: ComponentTypes.BUTTON,
  run: async ({ context, variable }) => {
    const guildId = String(variable);
    const guild = client.guilds.get(guildId);

    if (!guild) {
      return await errorMessage(bold(`${Emojis.CANCEL} The guild ${inlineCode(guildId)} has not been found`), {
        context,
      });
    }

    let channelId: MaybeNullish<string> = null;

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
        .setDescription(bold(`${Emojis.ARROW_CIRCLE_RIGHT} ${spoiler(`https://discord.gg/${invite.code}`)}`))
        .setColor(Colors.COLOR)
        .toJSON(true),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
