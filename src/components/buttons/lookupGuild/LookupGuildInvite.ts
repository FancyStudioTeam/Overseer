import { Emojis } from "@constants";
import { bold, spoiler } from "@discordjs/formatters";
import { client } from "@index";
import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage, createMessage, noop } from "@utils";
import { ChannelTypes } from "oceanic.js";

export default createButtonComponent({
  developerOnly: true,
  name: "@lookup_guild/invite",
  run: async ({ context, locale, variable: guildId }) => {
    await context.deferUpdate().catch(noop);

    const guild = client.guilds.get(guildId);

    if (!guild) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.GUILD_NOT_FOUND({
          guildId,
        }),
      );
    }

    const filteredChannels = guild.channels
      .filter((channel) => channel.type === ChannelTypes.GUILD_TEXT)
      .filter((channel) => channel.permissionsOf(guild.clientMember).has("CREATE_INSTANT_INVITE"));

    if (filteredChannels.length === 0) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.INVITE.OBTAIN_VALID_CHANNEL,
      );
    }

    const channelId = filteredChannels[0].id;
    const invite = await client.rest.channels.createInvite(channelId, {
      maxUses: 1,
    });

    return await createMessage(context, bold(`${Emojis.ARROW_CIRCLE_RIGHT} ${spoiler(invite.url)}`));
  },
});
