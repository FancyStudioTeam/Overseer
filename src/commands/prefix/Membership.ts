import { randomUUID } from "node:crypto";
import { Colors, Emojis } from "@constants";
import { bold, spoiler } from "@discordjs/formatters";
import { createPrefixCommand } from "@util/Handlers";
import { EmbedBuilder } from "oceanic-builders";

export default createPrefixCommand({
  developerOnly: true,
  name: "membership",
  run: async ({ client, context }) => {
    const { membershipId } = await client.prisma.clientMembership.create({
      data: {
        general: {
          type: "MONTH",
        },
        membershipId: randomUUID(),
      },
      select: {
        membershipId: true,
      },
    });
    const dmChannel = await client.rest.users.createDM(context.author.id);

    await client.rest.channels.createMessage(dmChannel.id, {
      embeds: new EmbedBuilder()
        .setDescription(bold(`${Emojis.ARROW_CIRCLE_RIGHT} ${spoiler(membershipId)}`))
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
