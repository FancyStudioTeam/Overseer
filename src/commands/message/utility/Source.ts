import { Emojis } from "@constants";
import { Translations } from "@translations";
import { createMessageCommand } from "@util/Handlers";
import { createMessage } from "@utils";
import { ActionRowBuilder, DangerButtonBuilder, FileBuilder } from "oceanic-builders";
import { ApplicationCommandTypes } from "oceanic.js";

export default createMessageCommand({
  name: "Source",
  type: ApplicationCommandTypes.MESSAGE,
  run: async ({ context, locale }) => {
    const messageTarget = context.data.target;
    const formattedMessagePayload = JSON.stringify(messageTarget, null, 2);

    await createMessage(context, {
      components: new ActionRowBuilder()
        .addComponents([
          new DangerButtonBuilder()
            .setCustomID(`@source/delete#${context.user.id}`)
            .setLabel(Translations[locale].COMMANDS.UTILITY.SOURCE.COMPONENTS.BUTTONS.DELETE.LABEL)
            .setEmoji(Emojis.TRASH_COLORED)
            .toJSON(),
        ])
        .toJSON(true),
      files: new FileBuilder().setContents(Buffer.from(formattedMessagePayload)).setName("Message.json").toJSON(true),
    });
  },
});
