import colors from "@colors/colors";
import { codeBlock } from "@sapphire/utilities";
import { Embed } from "oceanic-builders";
import { ApplicationCommandOptionTypes, type CommandInteraction } from "oceanic.js";
import { BaseBuilder } from "#base";
import { Colors } from "#constants";
import { _client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { padding } from "#util/Util.js";
// import { pagination } from "#util/Pagination";

export default new BaseBuilder<ChatInputSubCommand>({
  name: "help",
  directory: Directories.INFORMATION,
  run: async (_context: CommandInteraction, { locale }) => {
    const groupedCommands = [Directories.INFORMATION, Directories.MODERATION, Directories.UTILITY].map(
      (directory, _) => {
        return _client.interactions.chatInput.filter((command) => command?.directory === directory);
      },
    );
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
              [ApplicationCommandOptionTypes.SUB_COMMAND, ApplicationCommandOptionTypes.SUB_COMMAND_GROUP].includes(
                option2.type,
              ),
            )
          ) {
            option.options
              ?.filter((option2) =>
                [ApplicationCommandOptionTypes.SUB_COMMAND, ApplicationCommandOptionTypes.SUB_COMMAND_GROUP].includes(
                  option2.type,
                ),
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
        return new Embed()
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
      embeds: new Embed()
        .setTitle(
          Translations[locale].COMMANDS.INFORMATION.HELP.MESSAGE_1.TITLE_1({
            name: _client.user.globalName ?? _client.user.username,
          }),
        )
        .addFields(
          commands.map((data) => {
            return {
              name: Translations[locale].COMMANDS.INFORMATION.HELP.MESSAGE_1.FIELD_1.FIELD({
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
