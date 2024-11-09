import { Emojis } from "@constants";
import { Translations } from "@translations";
import { createMessageCommand } from "@util/Handlers";
import { createMessage, parseEmoji } from "@utils";
import { ActionRow, Attachment, Button } from "oceanic-builders";
import { ApplicationCommandTypes, ButtonStyles } from "oceanic.js";

export default createMessageCommand({
  name: "Source",
  type: ApplicationCommandTypes.MESSAGE,
  run: async ({ context, locale }) => {
    const messageTarget = context.data.target;
    const messagePayload = JSON.stringify(messageTarget, null, 2);

    await createMessage(context, {
      components: new ActionRow()
        .addComponents([
          new Button()
            .setCustomID(`@source/delete#${context.user.id}`)
            .setLabel(Translations[locale].COMMANDS.UTILITY.SOURCE.COMPONENTS.BUTTONS.DELETE.LABEL)
            .setStyle(ButtonStyles.DANGER)
            .setEmoji(parseEmoji(Emojis.TRASH_COLORED))
            .toJSON(),
        ])
        .toJSON(true),
      files: new Attachment().setContents(Buffer.from(messagePayload)).setName("Message.json").toJSON(true),
    });
  },
});
