import { ButtonStyles, type CommandInteraction } from "oceanic.js";
import xml2JS from "xml2js";
import { ActionRowBuilder } from "../../../../builders/ActionRow";
import { ButtonBuilder } from "../../../../builders/Button";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import type {
  WeatherCurrent,
  WeatherForecast,
  WeatherInfo,
} from "../../../../types";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "weather",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    const location = interaction.data.options.getString("location", true);
    const languages: Record<string, string> = {
      en: "en-US",
      es: "es-ES",
    };
    const data = await weather(location, {
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

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: data.info.weatherlocationname,
          iconURL: `${data.info.imagerelativeurl}law/${data.current.skycode}.gif`,
        })
        .setThumbnail(
          `${data.info.imagerelativeurl}law/${data.current.skycode}.gif`,
        )
        .addFields([
          {
            name: client.locales.__({
              phrase: "commands.utility.weather.message.field",
              locale: language,
            }),
            value: client.locales.__mf(
              {
                phrase: "commands.utility.weather.message.value",
                locale: language,
              },
              {
                location: data.info.weatherlocationname,
                temperature: `${data.current.temperature}°C - (${temperatureToF(
                  data.current.temperature,
                )}°F)`,
                humidity: `${data.current.humidity}%`,
                wind: data.current.winddisplay,
                weather: data.current.skytext,
              },
            ),
          },
        ])
        .setColor(client.config.colors.color)
        .toJSONArray(),
      components: new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
            .setCustomID(`weather-forecast/${data.info.encodedlocationname}`)
            .setLabel(
              client.locales.__({
                phrase: "commands.utility.weather.row.forecast.label",
                locale: language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1201588352915349597",
            }),
          new ButtonBuilder()
            .setLabel(
              client.locales.__({
                phrase: "commands.utility.weather.row.link.label",
                locale: language,
              }),
            )
            .setStyle(ButtonStyles.LINK)
            .setEmoji({
              name: "_",
              id: "1201589945853296780",
            })
            .setURL(data.info.url),
        ])
        .toJSONArray(),
    });
  },
});

function temperatureToF(input: string): number {
  return (Number(input) * 9) / 5 + 32;
}

export async function weather(
  location: string,
  options: {
    language: string;
  },
): Promise<{
  info: WeatherInfo;
  current: WeatherCurrent;
  forecast: WeatherForecast[];
} | null> {
  const parser = new xml2JS.Parser({
    charkey: "C$",
    attrkey: "A$",
    explicitArray: true,
  });
  const weatherRequest = await fetch(
    `http://weather.service.msn.com/find.aspx?src=outlook&weadegreetype=C&culture=${options.language}&weasearchstr=${location}`,
  );
  const weatherBody = await weatherRequest.text();

  if (weatherBody.indexOf("<") !== 0 && weatherBody.search(/not found/i) !== -1)
    return null;

  const json = await parser.parseStringPromise(weatherBody).catch(() => null);

  if (!json) return null;

  return {
    info: json.weatherdata.weather[0].A$ as WeatherInfo,
    current: json.weatherdata.weather[0].current[0].A$ as WeatherCurrent,
    forecast: (json.weatherdata.weather[0].forecast as any[]).map((f) => {
      return f.A$;
    }) as WeatherForecast[],
  };
}
