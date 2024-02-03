import { InteractionCollector } from "oceanic-collector";
import {
  type AnyInteractionGateway,
  ButtonStyles,
  type CommandInteraction,
  type Guild,
  InteractionTypes,
  MessageFlags,
} from "oceanic.js";
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
import {
  errorMessage,
  formatDate,
  formatString,
  handleError,
} from "../../../../util/util";

export default new SubCommand({
  name: "weather",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language, timezone, hour12 },
  ) => {
    const location = interaction.data.options.getString("location", true);
    const languages: Record<string, string> = {
      en: "en-US",
      es: "es-ES",
    };
    const parser = new xml2JS.Parser({
      charkey: "C$",
      attrkey: "A$",
      explicitArray: true,
    });

    await fetch(
      `http://weather.service.msn.com/find.aspx?src=outlook&weadegreetype=C&culture=${languages[language]}&weasearchstr=${location}`,
    )
      .then(async (response) => {
        const body = await response.text();

        if (body.indexOf("<") !== 0 && body.search(/not found/i) !== -1) {
          return errorMessage(interaction, true, {
            description: client.locales.__({
              phrase: "commands.utility.weather.location-not-found",
              locale: language,
            }),
          });
        }

        // biome-ignore lint/suspicious/noExplicitAny:
        parser.parseString(body, async (error: Error | null, json: any) => {
          if (error) {
            handleError(error, interaction, language);
          }

          const data = {
            info: json.weatherdata.weather[0].A$ as WeatherInfo,
            current: json.weatherdata.weather[0].current[0]
              .A$ as WeatherCurrent,
            forecast: json.weatherdata.weather[0].forecast as WeatherForecast[],
          };

          await interaction
            .reply({
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
                    value: `\`\`\`ansi\n${formatString(
                      client.locales.__mf(
                        {
                          phrase: "commands.utility.weather.message.value",
                          locale: language,
                        },
                        {
                          location: data.info.weatherlocationname,
                          temperature: `${
                            data.current.temperature
                          }°C - (${temperatureToF(
                            data.current.temperature,
                          )}°F)`,
                          humidity: `${data.current.humidity}%`,
                          wind: data.current.winddisplay,
                          weather: data.current.skytext,
                        },
                      ),
                      "∷",
                    )}\`\`\``,
                  },
                ])
                .setColor(client.config.colors.color)
                .toJSONArray(),
              components: new ActionRowBuilder()
                .addComponents([
                  new ButtonBuilder()
                    .setCustomID("weather-forecast")
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
            })
            .then(async (response) => {
              const message = response.hasMessage()
                ? response.message
                : await response.getMessage();
              const collector = new InteractionCollector({
                client: client,
                message: message,
                channel: interaction.channel,
                guild: interaction.guild as Guild,
                interactionType: InteractionTypes.MESSAGE_COMPONENT,
                time: 60000,
              });

              collector.on(
                "collect",
                async (collected: AnyInteractionGateway) => {
                  if (collected.isComponentInteraction()) {
                    if (collected.isButtonComponentInteraction()) {
                      switch (collected.data.customID) {
                        case "weather-forecast": {
                          collected.reply({
                            embeds: new EmbedBuilder()
                              .setAuthor({
                                name: data.info.weatherlocationname,
                                iconURL: `${data.info.imagerelativeurl}law/${data.current.skycode}.gif`,
                              })
                              .addFields(
                                data.forecast.slice(1, 5).map((f) => {
                                  return {
                                    name: client.locales.__mf(
                                      {
                                        phrase:
                                          "commands.utility.weather.message.field2",
                                        locale: language,
                                      },
                                      {
                                        date: formatDate(
                                          timezone,
                                          new Date(f.A$.date),
                                          hour12,
                                        ),
                                      },
                                    ),
                                    value: `\`\`\`ansi\n${formatString(
                                      client.locales.__mf(
                                        {
                                          phrase:
                                            "commands.utility.weather.message.value2",
                                          locale: language,
                                        },
                                        {
                                          day: f.A$.day,
                                          date: formatDate(
                                            timezone,
                                            new Date(f.A$.date),
                                            hour12,
                                          ),
                                          high: `${
                                            f.A$.high
                                          }°C - (${temperatureToF(
                                            f.A$.high,
                                          )}°F)`,
                                          low: `${
                                            f.A$.low
                                          }°C - (${temperatureToF(
                                            f.A$.low,
                                          )}°F)`,
                                          weather: f.A$.skytextday,
                                        },
                                      ),
                                      "∷",
                                    )}\`\`\``,
                                  };
                                }),
                              )
                              .setColor(client.config.colors.color)
                              .toJSONArray(),
                            flags: MessageFlags.EPHEMERAL,
                          });

                          break;
                        }
                      }
                    }
                  }
                },
              );

              collector.on("end", async () => {
                collector.removeAllListeners();

                message.components.forEach((r, _) => {
                  r.components.forEach((c, _) => {
                    c.disabled = true;
                  });
                });

                await message
                  .edit({
                    components: message.components,
                  })
                  .catch(() => null);
              });
            });
        });
      })
      .catch((error) => {
        handleError(error, interaction, language);
      });

    function temperatureToF(input: string): number {
      return (Number(input) * 9) / 5 + 32;
    }
  },
});
