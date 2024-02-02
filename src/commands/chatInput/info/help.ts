import {
  ComponentBuilder,
  EmbedBuilder,
  SelectMenu,
} from "@oceanicjs/builders";
import {
  ApplicationCommandTypes,
  type CommandInteraction,
  ComponentTypes,
  type MessageActionRow,
} from "oceanic.js";
import { ChatInputCommand } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";

export default new ChatInputCommand({
  name: "help",
  description: "Displays bot commands",
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: "",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setThumbnail(client.user.avatarURL())
        .setDescription(
          client.locales.__mf(
            {
              phrase: "commands.information.help.message",
              locale: language,
            },
            {
              mention: client.user.mention,
            },
          ),
        )
        .setColor(client.config.colors.color)
        .toJSON(true),
      components: new ComponentBuilder<MessageActionRow>()
        .addRow([
          new SelectMenu(
            ComponentTypes.STRING_SELECT,
            "help-plugins",
          ).addOptions(
            {
              label: client.locales.__({
                phrase: "commands.information.help.row.configuration.label",
                locale: language,
              }),
              value: "configuration",
              description: client.locales.__({
                phrase:
                  "commands.information.help.row.configuration.description",
                locale: language,
              }),
              emoji: {
                name: "_",
                id: "1201584289473630208",
              },
            },
            {
              label: client.locales.__({
                phrase: "commands.information.help.row.information.label",
                locale: language,
              }),
              value: "information",
              description: client.locales.__({
                phrase: "commands.information.help.row.information.description",
                locale: language,
              }),
              emoji: {
                name: "_",
                id: "1201585353258188820",
              },
            },
            {
              label: client.locales.__({
                phrase: "commands.information.help.row.moderation.label",
                locale: language,
              }),
              value: "moderation",
              description: client.locales.__({
                phrase: "commands.information.help.row.moderation.description",
                locale: language,
              }),
              emoji: {
                name: "_",
                id: "1201585640182141078",
              },
            },
            {
              label: client.locales.__({
                phrase: "commands.information.help.row.utility.label",
                locale: language,
              }),
              value: "utility",
              description: client.locales.__({
                phrase: "commands.information.help.row.utility.description",
                locale: language,
              }),
              emoji: {
                name: "_",
                id: "1201585025028735016",
              },
            },
          ),
        ])
        .toJSON(),
    });
  },
});
