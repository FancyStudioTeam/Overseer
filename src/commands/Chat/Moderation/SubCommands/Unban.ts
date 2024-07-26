import { Embed } from "oceanic-builders";
import { Base } from "#base";
import { Colors } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { errorMessage, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "unban",
  permissions: {
    user: ["BAN_MEMBERS"],
    bot: ["BAN_MEMBERS"],
  },
  directory: Directories.MODERATION,
  run: async ({ context, locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: context,
        }),
      });
    }

    const userOption = context.data.options.getUser("user", true);
    const reasonOption = sanitizeString(context.data.options.getString("reason") ?? "No reason", {
      maxLength: 50,
      espaceMarkdown: true,
    });
    const bannedUser = await client.rest.guilds.getBan(context.guildID, userOption.id).catch(() => undefined);

    if (!bannedUser) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.UNBAN.BAN_NOT_FOUND({
          ban: userOption.id,
        }),
      });
    }

    await client.rest.guilds.removeBan(context.guildID, bannedUser.user.id, reasonOption);

    await context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.UNBAN.MESSAGE_1({
            user: userOption.mention,
            moderator: context.user.mention,
            reason: reasonOption,
          }),
        )
        .setColor(Colors.GREEN)
        .toJSON(true),
    });
  },
});
