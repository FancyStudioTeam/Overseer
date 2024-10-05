import { randomUUID } from "node:crypto";
import { Colors, Emojis } from "@constants";
import { bold, spoiler } from "@discordjs/formatters";
import { client } from "@index";
import { createPrefixCommand } from "@util/Handlers.js";
import { Embed } from "oceanic-builders";

export default createPrefixCommand({
  developerOnly: true,
  name: "voucher",
  run: async ({ context }) => {
    const createdClientVoucher = await client.prisma.clientVoucher.create({
      data: {
        voucherId: randomUUID(),
        general: {
          type: "MONTH",
        },
      },
      select: {
        voucherId: true,
      },
    });
    const dmChannel = await client.rest.users.createDM(context.author.id);

    await client.rest.channels.createMessage(dmChannel.id, {
      embeds: new Embed()
        .setDescription(bold(`${Emojis.ARROW_CIRCLE_RIGHT} ${spoiler(createdClientVoucher.voucherId)}`))
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
    await client.rest.channels.createReaction(context.channelID, context.id, Emojis.CHECK_CIRCLE);
  },
});
