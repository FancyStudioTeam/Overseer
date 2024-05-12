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

export default new SubCommand({
  name: "avatar",
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.CHAT_INPUT
    >
  ) => {
    const _userOption =
      _interaction.data.options.getUser("user") ?? _interaction.user;

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setImage(_userOption.avatarURL())
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
