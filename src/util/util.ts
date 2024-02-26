import { format } from "@formkit/tempo";
import { DiscordSnowflake } from "@sapphire/snowflake";
import {
  type AnyInteractionGateway,
  type AnyTextableGuildChannel,
  ButtonStyles,
  type CreateMessageOptions,
  type EmbedOptions,
  type ExecuteWebhookOptions,
  type InteractionContent,
  type Member,
  type Message,
  MessageFlags,
  type PermissionName,
  type Role,
  type User,
} from "oceanic.js";
import type { RateLimiterMemory } from "rate-limiter-flexible";
import urlRegex from "url-regex";
import { ActionRowBuilder } from "../builders/ActionRow";
import { ButtonBuilder } from "../builders/Button";
import { EmbedBuilder } from "../builders/Embed";
import type { Fancycord } from "../classes/Client";
import { client } from "../index";
import { permissions } from "../locales/misc/reference";
import { WebhookType } from "../types";
import { logger } from "./logger";

export async function fetchUser(id: string): Promise<User | null | undefined> {
  const user = client.users.has(id)
    ? client.users.get(id)
    : await client.rest.users.get(id).catch(() => null);

  return user;
}

export async function fetchMember(
  context: AnyInteractionGateway,
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
        .setColor(client.config.colors.error)
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
    client: Fancycord;
    language: string;
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
        client.locales.__mf(
          {
            phrase:
              member.user.id === client.user.id
                ? "general.permissions.bot-guild-permissions"
                : "general.permissions.user-guild-permissions",
            locale: main.language,
          },
          {
            permission: requiredPermissions
              .map((p, _) => {
                return permissions[p][main.language];
              })
              .join(", "),
          }
        )
      )
      .setColor(client.config.colors.error)
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
    client: Fancycord;
    language: string;
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
        client.locales.__mf(
          {
            phrase:
              member.user.id === client.user.id
                ? "general.permissions.bot-channel-permissions"
                : "general.permissions.user-channel-permissions",
            locale: main.language,
          },
          {
            permission: requiredPermissions
              .map((p, _) => {
                return permissions[p][main.language];
              })
              .join(", "),
            channel: channel.mention,
          }
        )
      )
      .setColor(client.config.colors.error)
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
    Logs: {
      ID: process.env.LogsWebhookID,
      Token: process.env.LogsWebhookToken,
    },
    Reports: {
      ID: process.env.ReportsWebhookID,
      Token: process.env.ReportsWebhookToken,
    },
    GuildLogs: {
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
  error: Error,
  context: AnyInteractionGateway,
  language: string
): void {
  const id = DiscordSnowflake.generate().toString();

  webhook(WebhookType.Logs, {
    embeds: new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``
      )
      .addFields([
        {
          name: "**General information**",
          value: `<:_:1201948012830531644> **Report ID**: ${id}\n<:_:1201948012830531644> **User**: ${
            context.user.username
          }\n<:_:1201948012830531644> **User ID**: ${
            context.user.id
          }\n<:_:1201948012830531644> **Server**: ${
            context.guild?.name ?? "<:_:1201586248947597392>"
          }\n<:_:1201948012830531644> **Server ID**: ${
            context.guildID ?? "<:_:1201586248947597392>"
          }`,
        },
      ])
      .setColor(client.config.colors.error)
      .toJSONArray(),
  });

  if ("reply" in context) {
    context.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        })
        .setDescription(
          client.locales.__({
            phrase: "general.error.message",
            locale: language,
          })
        )
        .addFields([
          {
            name: client.locales.__({
              phrase: "general.error.field",
              locale: language,
            }),
            value: client.locales.__mf(
              {
                phrase: "general.error.value",
                locale: language,
              },
              {
                id: id,
                name: error.name,
              }
            ),
          },
        ])
        .setColor(client.config.colors.error)
        .toJSONArray(),
      components: new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
            .setLabel(
              client.locales.__({
                phrase: "general.error.row.support.label",
                locale: language,
              })
            )
            .setStyle(ButtonStyles.LINK)
            .setEmoji({
              name: "_",
              id: "1201585025028735016",
            })
            .setURL(client.config.links.support),
        ])
        .toJSONArray(),
    });
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

export function insertEmpty(array: unknown[]): any[] {
  const newArray = [];

  for (let i = 0; i < array.length; i++) {
    newArray.push(array[i]);

    if (i % 2 === 0) {
      newArray.push({
        name: "",
        value: "",
        inline: true,
      });
    }
  }

  return newArray;
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
