import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { ComparationLevel, compareMemberToMember, errorMessage, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "kick",
  permissions: {
    user: ["KICK_MEMBERS"],
    bot: ["KICK_MEMBERS"],
  },
  directory: Directories.MODERATION,
  run: async (context: CommandInteraction, { locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: context,
        }),
      });
    }

    const _memberOption = context.data.options.getMember("user");
    const _reasonOption = sanitizeString(context.data.options.getString("reason") ?? "No reason", {
      maxLength: 50,
      espaceMarkdown: true,
    });

    if (!_memberOption) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
      });
    }

    if (
      _memberOption.id === client.user.id ||
      _memberOption.id === context.guild.ownerID ||
      _memberOption.id === context.user.id
    ) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.CANNOT_MODERATE_MEMBER,
      });
    }

    if (compareMemberToMember(context.guild.clientMember, _memberOption) !== ComparationLevel.HIGHER) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.HIERARCHY.CLIENT,
      });
    }

    if (
      context.user.id !== context.guild.ownerID &&
      compareMemberToMember(context.member, _memberOption) !== ComparationLevel.HIGHER
    ) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.HIERARCHY.USER,
      });
    }

    await client.rest.guilds.removeMember(context.guildID, _memberOption.id, _reasonOption);

    await context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.KICK.MESSAGE_1({
            user: _memberOption.mention,
            moderator: context.user.mention,
            reason: _reasonOption,
          }),
        )
        .setColor(Colors.GREEN)
        .toJSON(true),
    });
  },
});
