import type { Camelize, DiscordUser } from "@discordeno/bot";
import { createUserCommand } from "@util/handlers.js";
import { createMessage } from "@utils";

const DISCORD_CDN_URL = "https://cdn.discordapp.com";
const DEFAULT_AVATAR_URL = (index: number) => `${DISCORD_CDN_URL}/embed/avatars/${index}`;
const USER_AVATAR_URL = (userId: string, hash: string) => `${DISCORD_CDN_URL}/avatars/${userId}/${hash}`;

const getAvatarUrl = (
  user: Camelize<DiscordUser>,
  options: GetAvatarUrlOptions = {
    format: "auto",
    size: 1024,
  },
) => {
  const { format, size } = options;
  const { avatar, discriminator, id } = user;

  if (!avatar) {
    /**
     * Checks if the user migrated to Discord's new username system.
     */
    const userMigrated = discriminator === "0";
    /**
     * Calculates the index for the default avatar.
     * If user has migrated, index is calculated as "(id >> 22) % 6".
     * Otherwise, it is calculated as "discriminator % 5".
     *
     * Reference: https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints
     */
    const index = userMigrated ? (Number.parseInt(id) >> 22) % 6 : Number.parseInt(discriminator) % 5;

    return `${DEFAULT_AVATAR_URL(index)}.${format}?size=${size}`;
  }

  /**
   * Determines the avatar format.
   * If format is set to "auto" and avatar hash starts with "a_", it returns "gif".
   * Otherwise, it returns "png".
   */
  const dynamicFormat = format === "auto" && avatar.startsWith("a_") ? "gif" : "png";

  return `${USER_AVATAR_URL(id, avatar)}.${dynamicFormat}?size=${size}`;
};

createUserCommand({
  name: "Avatar",
  run: async ({ client, context, t }) => {
    if (!context.data) {
      return;
    }

    const { targetId } = context.data;

    if (!targetId) {
      return createMessage(context, t("commands.global.unable_to_obtain_target_id"), {
        isEphemeral: true,
      });
    }

    const user = await client.rest.getUser(targetId);
    const avatarUrl = getAvatarUrl(user);

    createMessage(context, {
      image: {
        url: avatarUrl,
      },
    });

    return;
  },
});

interface GetAvatarUrlOptions {
  format?: "auto" | "gif" | "jpg" | "png" | "webp";
  size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
}
