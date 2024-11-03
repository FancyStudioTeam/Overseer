import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { createMessage } from "@util/utils";
import { Embed, EmbedField } from "oceanic-builders";

export default createChatInputSubCommand({
  category: CommandCategory.INFORMATION,
  name: "ping",
  // biome-ignore lint/suspicious/useAwait:
  run: async ({ client, context, locale }) => {
    const { rest: restLatency, shard: shardLatency } = {
      rest: Math.round(client.rest.handler.latencyRef.latency),
      shard: Math.round(context.guild.shard.latency),
    };

    createMessage(
      context,
      new Embed()
        .addFields([
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.PING.MESSAGE_1.FIELD_1.NAME)
            .setValue(
              Translations[locale].COMMANDS.INFORMATION.PING.MESSAGE_1.FIELD_1.VALUE({
                restLatency,
              }),
            )
            .setInline(true),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.PING.MESSAGE_1.FIELD_2.NAME)
            .setValue(
              Translations[locale].COMMANDS.INFORMATION.PING.MESSAGE_1.FIELD_2.VALUE({
                shardLatency,
              }),
            )
            .setInline(true),
        ])
        .toJSON(),
    );
  },
});
