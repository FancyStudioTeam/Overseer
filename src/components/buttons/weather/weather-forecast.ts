import { type ComponentInteraction, MessageFlags } from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import {
  temperatureToF,
  weather,
} from "../../../commands/chatInput/util/subcommands/weather";
import { errorMessage, formatTimestamp, insertEmpty } from "../../../util/util";

export default new Component({
  name: "weather-forecast",
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language, timezone, hour12, variable },
  ) => {
    const languages: Record<string, string> = {
      en: "en-US",
      es: "es-ES",
    };
    const data = await weather(variable ?? "", {
      language: languages[language],
    });

    if (!data) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.utility.weather.location-not-found",
          locale: language,
        }),
      });
    }

    const values = data.forecast.slice(1, 5).map((f) => {
      return {
        name: client.locales.__mf(
          {
            phrase: "commands.utility.weather.message.field2",
            locale: language,
          },
          {
            date: formatTimestamp(f.date, timezone, hour12),
          },
        ),
        value: client.locales.__mf(
          {
            phrase: "commands.utility.weather.message.value2",
            locale: language,
          },
          {
            day: f.day,
            date: formatTimestamp(f.date, timezone, hour12),
            high: `${f.high}°C - (${temperatureToF(f.high)}°F)`,
            low: `${f.low}°C - (${temperatureToF(f.low)}°F)`,
            weather: f.skytextday,
          },
        ),
        inline: true,
      };
    });

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: data.info.weatherlocationname,
          iconURL: `${data.info.imagerelativeurl}law/${data.current.skycode}.gif`,
        })
        .addFields(
          insertEmpty(values).map((f) => {
            return f;
          }),
        )
        .setColor(client.config.colors.COLOR)
        .toJSONArray(),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
