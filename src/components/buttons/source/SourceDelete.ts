import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createMessage } from "@util/utils";

export default createButtonComponent({
  name: "@source/delete",
  run: async ({ client, context, locale, variable: userId }) => {
    if (userId !== context.user.id) {
      return await createMessage(context, Translations[locale].GLOBAL.INVALID_USER_COLLECTOR);
    }

    return await client.rest.channels.deleteMessage(context.channelID, context.message.id);
  },
});
