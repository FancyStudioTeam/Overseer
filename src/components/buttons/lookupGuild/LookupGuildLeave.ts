import { client } from "@index";
import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage, createMessage } from "@utils";
import { noop } from "es-toolkit";
import { ComponentTypes } from "oceanic.js";

export default createButtonComponent({
  developerOnly: true,
  name: "@lookup_guild/leave",
  type: ComponentTypes.BUTTON,
  run: async ({ context, locale, variable: guildId }) => {
    await context.deferUpdate().catch(noop);

    const guild = client.guilds.get(guildId);

    if (!guild) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.GUILD_NOT_FOUND({
          guildId,
        }),
      );
    }

    await client.rest.users.leaveGuild(guild.id);

    return await createMessage(
      context,
      Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.LEAVE.MESSAGE_1({
        guildName: guild.name,
      }),
    );
  },
});
