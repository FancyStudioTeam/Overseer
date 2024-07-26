import { inlineCodeBlock } from "@sapphire/utilities";
import { Embed, EmbedField } from "oceanic-builders";
import { Base } from "#base";
import { Colors, Emojis } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { errorMessage } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "ping",
  directory: Directories.INFORMATION,
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

    const { rest, shard } = {
      rest: client.rest.handler.latencyRef.latency,
      shard: context.guild.shard.latency,
    };
    const signal = (latency: number): string =>
      latency <= 100
        ? Emojis.SIGNAL_GREEN
        : latency >= 101 && latency <= 200
          ? Emojis.SIGNAL_ORANGE
          : latency >= 201
            ? Emojis.SIGNAL_RED
            : Emojis.SIGNAL_RED;

    await context.reply({
      embeds: new Embed()
        .addFields([
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.PING.MESSAGE_1.FIELD_1.FIELD)
            .setValue(`${signal(rest)} ${inlineCodeBlock(` ${rest} ms `)}`)
            .setInline(true),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.PING.MESSAGE_1.FIELD_2.FIELD)
            .setValue(`${signal(shard)} ${inlineCodeBlock(` ${shard} ms `)}`)
            .setInline(true),
        ])
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
