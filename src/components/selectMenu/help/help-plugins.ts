import {
  ApplicationCommandOptionTypes,
  type ComponentInteraction,
  type MessageComponentSelectMenuInteractionData,
  MessageFlags,
} from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { descriptions } from "../../../locales/misc/commands";

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
      id?: string;
    }[] = [];

    client.interactions.chatInput
      .filter((c) => c.directory === data.values.getStrings()[0])
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
                description: descriptions[`${c.name}_${o.name}`][language],
                id: c.id,
              });
            } else if (
              o.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
            ) {
              o.options?.map((o2) => {
                commands.push({
                  name: `${c.name} ${o.name} ${o2.name}`,
                  description:
                    descriptions[`${c.name}_${o.name}_${o2.name}`][language],
                  id: c.id,
                });
              });
            }
          });
        } else {
          commands.push({
            name: c.name,
            description: descriptions[`${c.name}`][language],
            id: c.id,
          });
        }
      });

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        })
        .setDescription(
          commands
            .map((c) => {
              return `<:_:1201948012830531644> ${
                c.id ? `</${c.name}:${c.id}>` : `**/${c.name}**`
              }: ${c.description}`;
            })
            .join("\n"),
        )
        .setColor(client.config.colors.color)
        .toJSONArray(),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
