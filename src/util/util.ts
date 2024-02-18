import { DiscordSnowflake } from "@sapphire/snowflake";
import {
  type AnyInteractionGateway,
  ButtonStyles,
  type CreateMessageOptions,
  type EmbedOptions,
  type ExecuteWebhookOptions,
  type Member,
  MessageFlags,
  type Role,
  type User,
} from "oceanic.js";
import type { RateLimiterMemory } from "rate-limiter-flexible";
import urlRegex from "url-regex";
import { ActionRowBuilder } from "../builders/ActionRow";
import { ButtonBuilder } from "../builders/Button";
import { EmbedBuilder } from "../builders/Embed";
import { client } from "../index";
import { LogType, type UnixType, WebhookType } from "../types";

export function logger(message: string, type: LogType = LogType.Info): void {
  const date = new Date(Date.now()).toLocaleString("en-GB", {
    timeZone: "Europe/Madrid",
  });
  const colors = {
    Info: `[${date}] [\x1b[0;96mINF\x1b[0m] - ${message}`,
    Debug: `[${date}] [\x1b[0;94mDBG\x1b[0m] - ${message}`,
    Request: `[${date}] [\x1b[0;95mREQ\x1b[0m] - ${message}`,
    Error: `[${date}] [\x1b[0;91mERR\x1b[0m] - ${message}`,
    Warn: `[${date}] [\x1b[0;93mWRN\x1b[0m] - ${message}`,
    Database: `[${date}] [\x1b[0;92mDBS\x1b[0m] - ${message}`,
  };

  console.log(colors[type]);
}

export function formatString(content: string, separator: string): string {
  const lines = content.split("\n");
  let maxLength = 0;

  for (const line of lines) {
    const length = line.split(` ${separator} `)[0].length;

    if (length > maxLength) {
      maxLength = length;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(` ${separator} `);

    while (parts[0].length < maxLength) {
      parts[0] += " ";
    }

    parts[0] = `\x1b[1;35m${parts[0]}\x1b[0m`;
    parts[1] = `\x1b[1;36m${parts[1]}\x1b[0m`;
    lines[i] = parts.join(` ${separator} `);
  }

  return lines.join("\n");
}

export function unix(time: string, type: UnixType): string {
  const dateString = time;
  const date = new Date(dateString);
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  const formats = {
    Default: `<t:${unixTimestamp}>`,
    Relative: `<t:${unixTimestamp}:R>`,
  };

  return formats[type];
}

export async function fetchUser(id: string): Promise<User | null> {
  let user: any;

  if (client.users.has(id)) {
    user = client.users.get(id);
    logger(`[FetchUser] User ${user.username} has been fetched from cache`);
  } else {
    user = await client.rest.users.get(id).catch(() => null);

    if (user) {
      logger(`[FetchUser] User ${user.username} has been fetched from REST`);
    }
  }

  return user;
}

export async function fetchMember(
  context: AnyInteractionGateway,
  id: string,
): Promise<Member | null> {
  let member: any;

  if (!context.guild) return null;

  if (context.guild.members.has(id)) {
    member = context.guild.members.get(id);
    logger(
      `[FetchMember] Member ${member.user.username} has been fetched from cache`,
    );
  } else {
    member = await client.rest.guilds
      .getMember(context.guild.id, id)
      .catch(() => null);

    if (member) {
      logger(
        `[FetchMember] Member ${member.user.username} has been fetched from REST`,
      );
    }
  }

  return member;
}

export function sleep(ms: number): Promise<void> {
  logger(`[Sleep] Sleeping ${ms} milliseconds...`);

  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function errorMessage(
  context: AnyInteractionGateway,
  ephemeral: boolean,
  embed: EmbedOptions,
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
    }),
  );

  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      message = message.replace(
        element,
        element.replace(element, "**_(Link detected)_**"),
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

export function formatDate(
  timezone: string,
  date: Date,
  hour12: boolean,
): string {
  const formatedDate = date.toLocaleString("en-GB", {
    timeZone: timezone,
    hour12: hour12,
  });

  return formatedDate;
}

export function webhook(
  type: WebhookType,
  options: CreateMessageOptions,
  profile: ExecuteWebhookOptions = {
    username: client.user.username,
    avatarURL: client.user.avatarURL(),
  },
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
  language: string,
): void {
  const id = DiscordSnowflake.generate().toString();

  webhook(WebhookType.Logs, {
    embeds: new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``,
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
          }),
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
              },
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
              }),
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
  rateLimiter: RateLimiterMemory,
): Promise<RateLimiterResponse> {
  return rateLimiter
    .consume(key)
    .then((response) => {
      logger(
        `[RateLimiter] Consumed "${response.consumedPoints}" points from "${key}" - Remaining points: ${response.remainingPoints}`,
      );

      return {
        rateLimited: false,
        points: response.remainingPoints,
        resets: response.msBeforeNext,
      };
    })
    .catch((response) => {
      logger(
        `[RateLimiter] Rate Limited "${key}" | Resets in ${response.msBeforeNext} milliseconds`,
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
