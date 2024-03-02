import {
  ApplicationCommandOptionTypes,
  type ComponentInteraction,
  type MessageComponentSelectMenuInteractionData,
  MessageFlags,
} from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { Colors } from "../../../constants";

export default new Component({
  name: "help-plugins",
  run: async (client: Fancycord, interaction: ComponentInteraction) => {
    const data = <MessageComponentSelectMenuInteractionData>interaction.data;
    const commands: {
      name: string;
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
            ].includes(c.type)
          )
        ) {
          c.options.map((o) => {
            if (o.type === ApplicationCommandOptionTypes.SUB_COMMAND) {
              commands.push({
                name: `${c.name} ${o.name}`,
                id: c.id,
              });
            } else if (
              o.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
            ) {
              o.options?.map((o2) => {
                commands.push({
                  name: `${c.name} ${o.name} ${o2.name}`,
                  id: c.id,
                });
              });
            }
          });
        } else {
          commands.push({
            name: c.name,
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
        .setThumbnail(client.user.avatarURL())
        .setDescription(
          `\`\`\`yml\n${commands
            .map((c) => {
              return `/${c.name}`;
            })
            .join("\n")}\`\`\``
        )
        .setColor(Colors.COLOR)
        .toJSONArray(),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
