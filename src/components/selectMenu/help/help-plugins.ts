import { EmbedBuilder } from "@oceanicjs/builders";
import {
  ApplicationCommandOptionTypes,
  type ComponentInteraction,
  type MessageComponentSelectMenuInteractionData,
  MessageFlags,
} from "oceanic.js";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { formatString } from "../../../util/util";

export default new Component({
  name: "help-plugins",
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language },
  ) => {
    const data = interaction.data as MessageComponentSelectMenuInteractionData;
    const commands: {
      name: string;
      description: string;
    }[] = [];

    client.interactions.chatInput
      .filter((c) => c.directory === data.values.raw[0])
      .map((c) => {
        if (
          c.options?.some((c) =>
            [
              ApplicationCommandOptionTypes.SUB_COMMAND,
              ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
            ].includes(c.type),
          )
        ) {
          c.options.map((o) => {
            if (o.type === ApplicationCommandOptionTypes.SUB_COMMAND) {
              commands.push({
                name: `${c.name} ${o.name}`,
                description: o.description,
              });
            } else if (
              o.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
            ) {
              o.options?.map((o2) => {
                commands.push({
                  name: `${c.name} ${o.name} ${o2.name}`,
                  description: o2.description,
                });
              });
            }
          });
        } else {
          commands.push({
            name: c.name,
            description: c.description,
          });
        }
      });

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor(client.user.username, client.user.avatarURL())
        .addFields(
          commands.map((c) => {
            return {
              name: client.locales.__mf(
                {
                  phrase: "commands.information.help.row.message.field",
                  locale: language,
                },
                {
                  command: c.name,
                },
              ),
              value: `\`\`\`ansi\n\x1b[1;35m${formatString(
                client.locales.__mf(
                  {
                    phrase: "commands.information.help.row.message.value",
                    locale: language,
                  },
                  {
                    command: `/${c.name}`,
                    description: c.description,
                  },
                ),
                "∷",
              )}\x1b[0m\`\`\``,
            };
          }),
        )
        .setColor(client.config.colors.color)
        .toJSON(true),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
