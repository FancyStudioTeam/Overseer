import { client } from "@index";
import { ChannelTypes } from "oceanic.js";

export default () => {
  client.on("messageCreate", async (message) => {
    if (!(message.inCachedGuildChannel() && message.guild)) return;

    const guildSuggestion = await client.prisma.guildSuggestion.findUnique({
      where: {
        guildId: message.guildID,
      },
    });

    if (guildSuggestion?.general.useMessageSuggestion) {
      const isForumEnabled = guildSuggestion.general.forum.enabled;

      if (isForumEnabled) {
        const forumChannel = message.guild.channels.get(String(guildSuggestion.general.forum.forumChannelId));

        if (forumChannel?.type !== ChannelTypes.GUILD_FORUM) return;

        const threadChannel = forumChannel.threads.get(String(guildSuggestion.general.forum.threadId));

        if (!threadChannel) return;

        if (guildSuggestion.general.forum.threadId === threadChannel.id) {
          await client.rest.channels.startThreadInThreadOnlyChannel(forumChannel.id, {
            autoArchiveDuration: 1440,
            name: `${message.author.name} Suggestion`,
            message: {},
          });
        }
      }
    }
  });
};
