import type {
  AnyInteractionChannel,
  ApplicationCommandTypes,
  CommandInteraction,
  Uncached,
} from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Colors } from "../../../../constants";
import { Translations } from "../../../../locales";
import type { Locales } from "../../../../types";
import { prisma } from "../../../../util/db";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "language",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.CHAT_INPUT
    >,
    { locale }
  ) => {
    if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) {
      return await errorMessage(_interaction, true, {
        description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: _interaction,
        }),
      });
    }

    const _languageOption = _interaction.data.options.getString(
      "language",
      true
    );

    await prisma.guildConfiguration
      .upsert({
        where: {
          guild_id: _interaction.guild.id,
        },
        update: {
          language: _languageOption,
        },
        create: {
          guild_id: _interaction.guild.id,
          language: _languageOption,
        },
      })
      .then(async (updatedData) => {
        await _interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              Translations[<Locales>updatedData.language].COMMANDS.CONFIG
                .LANGUAGE.MESSAGE_1
            )
            .setColor(Colors.SUCCESS)
            .toJSONArray(),
        });
      });
  },
});
