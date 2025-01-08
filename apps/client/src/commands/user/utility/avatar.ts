import { iconBigintToHash } from "@discordeno/bot";
import type { User } from "@types";
import { createUserCommand } from "@util/handlers.js";
import { createMessage } from "@utils";

const DISCORD_CDN_URL = "https://cdn.discordapp.com";
const DEFAULT_AVATAR_URL = (index: number) => `${DISCORD_CDN_URL}/embed/avatars/${index}`;
const USER_AVATAR_URL = (userId: string, hash: string) => `${DISCORD_CDN_URL}/avatars/${userId}/${hash}`;

const getAvatarUrl = (
  user: User,
  options: GetAvatarUrlOptions = {
    format: "auto",
    size: 1024,
  },
) => {
  const { format, size } = options;
  const { avatar: avatarBigInt, discriminator, id: idBigInt } = user;
  const id = idBigInt.toString();
  const avatar = avatarBigInt ? iconBigintToHash(avatarBigInt) : undefined;

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
  run: async ({ context, targetUser }) => {
    const avatarUrl = getAvatarUrl(targetUser);

    await createMessage(context, {
      image: {
        url: avatarUrl,
      },
    });
  },
});

interface GetAvatarUrlOptions {
  format?: "auto" | "gif" | "jpg" | "png" | "webp";
  size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
}
