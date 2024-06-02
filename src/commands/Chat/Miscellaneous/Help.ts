import colors from "@colors/colors";
import { codeBlock } from "@sapphire/utilities";
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, type CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { type ChatInputCommandInterface, Directory } from "#types";
import { padding } from "#util";
// import { pagination } from "#util/Pagination";

export default new BaseBuilder<ChatInputCommandInterface>({
    name: "help",
    description: "Displays bot commands",
    descriptionLocalizations: {
        "es-419": "Muestra los comandos del bot",
        "es-ES": "Muestra los comandos del bot",
    },
    type: ApplicationCommandTypes.CHAT_INPUT,
    dmPermission: false,
    directory: Directory.MISCELLANEOUS,
    run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
        const groupedCommands = [
            Directory.CONFIGURATION,
            Directory.INFORMATION,
            Directory.MODERATION,
            Directory.UTILITY,
        ].map((directory, _) => {
            return _client.interactions.chatInput.filter((command) => command?.directory === directory);
        });
        const commands = groupedCommands.map((group) => {
            const data: {
                base: string;
                commands: string[];
            } = {
                base: "",
                commands: [],
            };

            group.map((command) => {
                data.base = String(command?.name);
                command?.options?.map((option) => {
                    if (
                        "options" in option &&
                        option.options?.some((option2) =>
                            [
                                ApplicationCommandOptionTypes.SUB_COMMAND,
                                ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
                            ].includes(option2.type),
                        )
                    ) {
                        option.options
                            ?.filter((option2) =>
                                [
                                    ApplicationCommandOptionTypes.SUB_COMMAND,
                                    ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
                                ].includes(option2.type),
                            )
                            .map((option2) => {
                                data.commands.push(
                                    `${colors.reset.cyan(`${option.name} ${option2.name}`)} - ${colors.bold.magenta(
                                        {
                                            EN: option2.description,
                                            ES: option2.descriptionLocalizations?.["es-ES"],
                                        }[locale] ?? option2.description,
                                    )}`,
                                );
                            });
                    } else {
                        data.commands.push(
                            `${colors.reset.cyan(option.name)} - ${colors.bold.magenta(
                                {
                                    EN: option.description,
                                    ES: option.descriptionLocalizations?.["es-ES"],
                                }[locale] ?? option.description,
                            )}`,
                        );
                    }
                });
            });

            return data;
        });

        /*pagination(
      {
        _context,
        locale,
        ephemeral: false,
      },
      commands.map((group) => {
        return new EmbedBuilder()
          .setTitle(
            Translations[locale].HELP.MESSAGE_1.TITLE_1({
              name: _client.user.globalName ?? _client.user.username,
            }),
          )
          .setDescription(
            codeBlock(
              "ansi",
              padding(
                group.commands
                  .map((command) => {
                    return command;
                  })
                  .join("\n"),
                "-",
              ),
            ),
          )
          .setColor(Colors.COLOR)
          .toJSON();
      }),
    );*/

        await _context.reply({
            embeds: new EmbedBuilder()
                .setTitle(
                    Translations[locale].HELP.MESSAGE_1.TITLE_1({
                        name: _client.user.globalName ?? _client.user.username,
                    }),
                )
                .addFields(
                    commands.map((data) => {
                        return {
                            name: Translations[locale].HELP.MESSAGE_1.FIELD_1.FIELD({
                                command: data.base,
                            }),
                            value: codeBlock(
                                "ansi",
                                padding(
                                    data.commands
                                        .map((command) => {
                                            return command;
                                        })
                                        .join("\n"),
                                    "-",
                                ),
                            ),
                        };
                    }),
                )
                .setColor(Colors.COLOR)
                .toJSONArray(),
        });
    },
});
