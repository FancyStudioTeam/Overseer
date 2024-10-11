import { Colors, Emojis } from "@constants";
import { bold, inlineCode, spoiler } from "@discordjs/formatters";
import { client } from "@index";
import type { MaybeNullish } from "@types";
import { createComponent } from "@util/Handlers";
import { createErrorMessage } from "@utils";
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
      return await createErrorMessage(context, {
        content: bold(`${Emojis.CANCEL} The guild ${inlineCode(guildId)} has not been found`),
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
      return await createErrorMessage(context, {
        content: bold(`${Emojis.CANCEL} No valid channel ID found`),
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
