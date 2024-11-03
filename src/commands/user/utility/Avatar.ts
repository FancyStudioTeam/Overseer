import { Colors } from "@constants";
import { createUserCommand } from "@util/Handlers";
import { createMessage } from "@utils";
import { Embed } from "oceanic-builders";
import { ApplicationCommandTypes } from "oceanic.js";

export default createUserCommand({
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  run: async ({ context }) => {
    const userTarget = context.data.target;

    await createMessage(context, new Embed().setImage(userTarget.avatarURL()).setColor(Colors.COLOR).toJSON());
  },
});
