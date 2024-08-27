import { randomUUID } from "node:crypto";
import { Embed } from "oceanic-builders";
import { Colors, Emojis } from "#constants";
import { client } from "#index";
import { createPrefixCommand } from "#util/Handlers";
import { prisma } from "#util/Prisma.js";

export default createPrefixCommand({
  name: "voucher",
  run: async ({ context }) => {
    const createdClientVoucher = await prisma.clientVoucher.create({
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
        .setDescription(`**${Emojis.CIRCLE_CHEVRON_RIGHT} ||${createdClientVoucher.voucherId}||**`)
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
