import { Colors } from "@constants";
import { client } from "@index";
import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage, createMessage, noop } from "@utils";
import { Embed, EmbedField } from "oceanic-builders";
import { ComponentTypes } from "oceanic.js";

export default createButtonComponent({
  developerOnly: true,
  name: "@lookup_guild/owner",
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

    const owner = await client.fetchMember(guild, guild.ownerID ?? "");

    if (!owner) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.OWNER.UNABLE_VALID_OWNER,
      );
    }

    return await createMessage(
      context,
      new Embed()
        .setTitle(Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.OWNER.MESSAGE_1.TITLE)
        .addFields([
          new EmbedField()
            .setName(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.OWNER.MESSAGE_1.FIELD_1.NAME,
            )
            .setValue(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.OWNER.MESSAGE_1.FIELD_1.VALUE({
                userId: owner.id,
                userName: owner.user.name,
              }),
            ),
          new EmbedField()
            .setName(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.OWNER.MESSAGE_1.FIELD_2.NAME,
            )
            .setValue(
              Translations[locale].COMMANDS.DEVELOPER.LOOKUP_GUILD.COMPONENTS.BUTTONS.OWNER.MESSAGE_1.FIELD_2.VALUE({
                createdAt: owner.createdAt,
              }),
            ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(),
    );
  },
});
