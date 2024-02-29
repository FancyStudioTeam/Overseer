import { format } from "@formkit/tempo";
import { ParsedCustomEmojiWithGroups } from "@sapphire/discord-utilities";
import { DiscordSnowflake } from "@sapphire/snowflake";
import {
  type AnyInteractionGateway,
  type AnyTextableGuildChannel,
  type CreateMessageOptions,
  type EmbedOptions,
  type ExecuteWebhookOptions,
  type InteractionContent,
  type Member,
  type Message,
  MessageFlags,
  type NullablePartialEmoji,
  type PermissionName,
  type Role,
  type User,
} from "oceanic.js";
import type { RateLimiterMemory } from "rate-limiter-flexible";
import urlRegex from "url-regex";
import { client } from "..";
import { EmbedBuilder } from "../builders/Embed";
import { permissions } from "../locales/misc/reference";
import { WebhookType } from "../types";
import type { Locales } from "../types";
import { Colors, Emojis, Links, Translations } from "./constants";
import { logger } from "./logger";

export async function fetchUser(id: string): Promise<User | null | undefined> {
  const user = client.users.has(id)
    ? client.users.get(id)
    : await client.rest.users.get(id).catch(() => null);

  return user;
}

export async function fetchMember(
  context: AnyInteractionGateway | Message,
  id: string
): Promise<Member | null | undefined> {
  if (!context.inCachedGuildChannel() || !context.guild) return null;

  const member = context.guild.members.has(id)
    ? context.guild.members.get(id)
    : await client.rest.guilds
        .getMember(context.guild.id, id)
        .catch(() => null);

  return member;
}

export function sleep(ms: number): Promise<void> {
  logger.log("INF", `Sleeping ${ms}ms...`);

  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function errorMessage(
  context: AnyInteractionGateway,
  ephemeral: boolean,
  embed: EmbedOptions
): void {
  if ("reply" in context) {
    context.reply({
      embeds: new EmbedBuilder()
        .load(embed)
        .setColor(Colors.ERROR)
        .toJSONArray(),
      flags: ephemeral ? MessageFlags.EPHEMERAL : undefined,
    });
  }
}

export function cleanContent(content: string): string {
  let message = content;
  const elements = message.match(
    urlRegex({
      strict: false,
    })
  );

  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      message = message.replace(
        element,
        element.replace(element, "**_(Link detected)_**")
      );
    }
  }

  return message;
}

export function parseEmoji(emoji: string): NullablePartialEmoji {
  // biome-ignore lint/style/noNonNullAssertion:
  const match = emoji.match(ParsedCustomEmojiWithGroups)!;

  return {
    name: match[2],
    id: match[3],
  };
}

export function getHighestRole(member: Member): Role | null {
  return (
    member.roles
      // biome-ignore lint/style/noNonNullAssertion:
      .map((r) => member.guild.roles.get(r)!)
      .sort((a, b) => b.position - a.position)[0] ?? null
  );
}

export function compareMemberToMember(from: Member, to: Member): string {
  const a = getHighestRole(from)?.position ?? -1;
  const b = getHighestRole(to)?.position ?? -1;

  if (a > b) {
    return "higher";
  }

  if (a < b) {
    return "lower";
  }

  if (a === b) {
    return "same";
  }

  return "unknown";
}

export function trim(content: string, max: number): string {
  return content.length > max ? `${content.slice(0, max - 3)}...` : content;
}

export function formatTimestamp(
  date: Date | string,
  timezone: string,
  hour12: boolean
): string {
  return format({
    date,
    format: hour12 ? "DD/MM/YYYY, hh:mm:ss A" : "DD/MM/YYYY, HH:mm:ss",
    locale: "en",
    tz: timezone,
  });
}

export function checkGuildPermissions(
  main: {
    locale: Locales;
  },
  context: AnyInteractionGateway | Message,
  checkPermissions: PermissionName[],
  member: Member,
  ephemeral: boolean
): boolean {
  const requiredPermissions: PermissionName[] = [];
  let hasPermissions = true;

  if (!context.inCachedGuildChannel() || !context.guild) return false;

  checkPermissions.forEach((p, _) => {
    if (!member.permissions.has(p)) {
      requiredPermissions.push(p);
    }
  });

  const payload: CreateMessageOptions | InteractionContent = {
    embeds: new EmbedBuilder()
      .setDescription(
        member.user.id === client.user.id
          ? Translations[main.locale].GENERAL.PERMISSIONS.GUILD.CLIENT({
              permissions: requiredPermissions
                .map((p, _) => {
                  return `\`${permissions[p][main.locale]}\``;
                })
                .join(", "),
            })
          : Translations[main.locale].GENERAL.PERMISSIONS.GUILD.USER({
              permissions: requiredPermissions
                .map((p, _) => {
                  return `\`${permissions[p][main.locale]}\``;
                })
                .join(", "),
            })
      )
      .setColor(Colors.ERROR)
      .toJSONArray(),
    flags: ephemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  if (
    requiredPermissions.length &&
    !member.permissions.has(...requiredPermissions)
  ) {
    hasPermissions = false;

    if ("reply" in context) {
      context.reply(payload);
    } else {
      client.rest.channels
        .createMessage(context.channelID, payload)
        .catch(() => null);
    }
  }

  return hasPermissions;
}

export function checkChannelPermissions(
  main: {
    locale: Locales;
  },
  context: AnyInteractionGateway | Message,
  checkPermissions: PermissionName[],
  member: Member,
  channel: AnyTextableGuildChannel,
  ephemeral: boolean
): boolean {
  const requiredPermissions: PermissionName[] = [];
  let hasPermissions = true;

  checkPermissions.forEach((p, _) => {
    if (!channel.permissionsOf(member).has(p)) {
      requiredPermissions.push(p);
    }
  });

  const payload: CreateMessageOptions | InteractionContent = {
    embeds: new EmbedBuilder()
      .setDescription(
        member.user.id === client.user.id
          ? Translations[main.locale].GENERAL.PERMISSIONS.CHANNEL.CLIENT({
              permissions: requiredPermissions
                .map((p, _) => {
                  return `\`${permissions[p][main.locale]}\``;
                })
                .join(", "),
              channel: channel.mention,
            })
          : Translations[main.locale].GENERAL.PERMISSIONS.CHANNEL.USER({
              permissions: requiredPermissions
                .map((p, _) => {
                  return `\`${permissions[p][main.locale]}\``;
                })
                .join(", "),
              channel: channel.mention,
            })
      )
      .setColor(Colors.ERROR)
      .toJSONArray(),
    flags: ephemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  if (
    requiredPermissions.length &&
    !channel.permissionsOf(member).has(...requiredPermissions)
  ) {
    hasPermissions = false;

    if ("reply" in context) {
      context.reply(payload);
    } else {
      client.rest.channels
        .createMessage(context.channelID, payload)
        .catch(() => null);
    }
  }

  return hasPermissions;
}

export function webhook(
  type: WebhookType,
  options: CreateMessageOptions,
  profile: ExecuteWebhookOptions = {
    username: client.user.username,
    avatarURL: client.user.avatarURL(),
  }
): void {
  const credentials = {
    LOGS: {
      ID: process.env.LogsWebhookID,
      Token: process.env.LogsWebhookToken,
    },
    REPORTS: {
      ID: process.env.ReportsWebhookID,
      Token: process.env.ReportsWebhookToken,
    },
    GUILD_LOGS: {
      ID: process.env.GuildLogsWebhookID,
      Token: process.env.GuildLogsWebhookToken,
    },
  };

  client.rest.webhooks
    .execute(credentials[type].ID, credentials[type].Token, {
      ...profile,
      ...options,
    })
    .catch(() => null);
}

export function handleError(
  main: {
    locale: Locales;
  },
  error: Error,
  context: AnyInteractionGateway | Message
): void {
  logger.log("ERR", error.stack ?? error.message);

  const id = DiscordSnowflake.generate().toString();
  const payload: CreateMessageOptions | InteractionContent = {
    embeds: new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        Translations[main.locale].GENERAL.SOMETHING_WENT_WRONG.MESSAGE({
          support: Links.SUPPORT,
        })
      )
      .addFields([
        {
          name: Translations[main.locale].GENERAL.SOMETHING_WENT_WRONG.FIELDS[0]
            .FIELD,
          value: Translations[
            main.locale
          ].GENERAL.SOMETHING_WENT_WRONG.FIELDS[0].VALUE({
            id,
            name: error.name,
          }),
        },
      ])
      .setColor(Colors.ERROR)
      .toJSONArray(),
  };

  webhook(WebhookType.LOGS, {
    embeds: [
      new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        })
        .setDescription(
          [
            `${Emojis.RIGHT} **Report ID**: ${id}`,
            `${Emojis.RIGHT} **User**: ${
              ("user" in context && context.user.username) ??
              ("author" in context && context.author.username)
            }`,
            `${Emojis.RIGHT} **User ID**: ${
              ("user" in context && context.user.id) ??
              ("author" in context && context.author.id)
            }`,
            `${Emojis.RIGHT} **Server**: ${context.guild?.name ?? Emojis.MARK}`,
            `${Emojis.RIGHT} **Server ID**: ${
              context.guild?.id ?? Emojis.MARK
            }`,
          ].join("\n")
        )
        .setColor(Colors.ERROR)
        .toJSON(),
      new EmbedBuilder()
        .setDescription(
          `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``
        )
        .setColor(Colors.ERROR)
        .toJSON(),
    ],
  });

  if ("reply" in context) {
    context.reply(payload);
  } else {
    client.rest.channels
      .createMessage(context.channelID, payload)
      .catch(() => null);
  }
}

export function bitFieldValues(bitField: number): number[] {
  const array = [];

  for (let i = 0; i < Math.log2(bitField) + 1; i++) {
    const power = 2 ** i;
    const result = bitField & power;

    if (result !== 0) {
      array.push(result);
    }
  }

  return array;
}

export async function consume(
  key: string,
  rateLimiter: RateLimiterMemory
): Promise<RateLimiterResponse> {
  return rateLimiter
    .consume(key)
    .then((response) => {
      logger.log(
        "INF",
        `Consumed "${response.consumedPoints}" points from "${key}" | Remaining points: ${response.remainingPoints}`
      );

      return {
        rateLimited: false,
        points: response.remainingPoints,
        resets: response.msBeforeNext,
      };
    })
    .catch((response) => {
      logger.log(
        "WRN",
        `Rate Limited "${key}" | Resets in ${response.msBeforeNext}ms`
      );

      return {
        rateLimited: true,
        points: response.remainingPoints,
        resets: response.msBeforeNext,
      };
    });
}

interface RateLimiterResponse {
  rateLimited: boolean;
  points: number;
  resets: number;
}
