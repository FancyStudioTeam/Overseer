import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage } from "@util/utils";
import { noop } from "es-toolkit";
import { ActionRowBuilder } from "oceanic-builders";
import type { TextButton } from "oceanic.js";

const manageVotes = (primaryArray: string[], secondaryArray: string[], element: string) => {
  if (primaryArray.includes(element)) {
    const index = primaryArray.indexOf(element);

    primaryArray.splice(index, 1);
  } else if (secondaryArray.includes(element)) {
    const index = secondaryArray.indexOf(element);

    secondaryArray.splice(index, 1);
    primaryArray.unshift(element);
  } else {
    primaryArray.unshift(element);
  }

  return {
    primaryArray,
    secondaryArray,
  };
};

export default createButtonComponent({
  name: "@suggestion/downvote",
  run: async ({ client, context, locale }) => {
    await context.deferUpdate().catch(noop);

    const originalMessage = context.message;
    const userSuggestion = await client.prisma.userSuggestion.findUnique({
      where: {
        guildId: context.guildID,
        messageId: originalMessage.id,
      },
    });

    if (!userSuggestion) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.SUGGESTION_NOT_FOUND,
      );
    }

    const { suggestionDownVotes, suggestionUpVotes } = {
      suggestionDownVotes: userSuggestion.votesDown,
      suggestionUpVotes: userSuggestion.votesUp,
    };
    const { primaryArray: downVotes, secondaryArray: upVotes } = manageVotes(
      suggestionDownVotes,
      suggestionUpVotes,
      context.user.id,
    );
    const { votesDown, votesUp } = await client.prisma.userSuggestion.update({
      data: {
        votesDown: downVotes,
        votesUp: upVotes,
      },
      where: {
        suggestionId: userSuggestion.suggestionId,
      },
    });
    const firstActionRow = new ActionRowBuilder(originalMessage.components[0]).toJSON();
    const rawUpVoteButton = firstActionRow.components[0] as TextButton;
    const rawDownVoteButton = firstActionRow.components[1] as TextButton;

    rawUpVoteButton.label = votesUp.length.toString();
    rawDownVoteButton.label = votesDown.length.toString();

    return await client.rest.channels.editMessage(originalMessage.channelID, originalMessage.id, {
      components: originalMessage.components,
    });
  },
});
