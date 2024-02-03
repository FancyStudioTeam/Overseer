import { DiscordSnowflake } from "@sapphire/snowflake";
import {
  type AnyInteractionGateway,
  type CreateMessageOptions,
  type Embed,
  type ExecuteWebhookOptions,
  type Member,
  MessageFlags,
  type Role,
  type User,
} from "oceanic.js";
import urlRegex from "url-regex";
import { client } from "../index";
import { LogType, UnixType, WebhookType } from "../types";

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
    logger(`User ${user.username} has been fetched from cache`, LogType.Info);
  } else {
    user = await client.rest.users.get(id).catch(() => null);

    if (user) {
      logger(`User ${user.username} has been fetched from REST`, LogType.Info);
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
      `Member ${member.user.username} has been fetched from cache`,
      LogType.Info,
    );
  } else {
    member = await client.rest.guilds
      .getMember(context.guild.id, id)
      .catch(() => null);

    if (member) {
      logger(
        `Member ${member.user.username} has been fetched from REST`,
        LogType.Info,
      );
    }
  }

  return member;
}

export function sleep(ms: number): Promise<void> {
  logger(`Sleeping ${ms} milliseconds...`, LogType.Info);

  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function errorMessage(
  context: AnyInteractionGateway,
  ephemeral: boolean,
  embed: Embed,
): void {
  if (
    context.isCommandInteraction() ||
    context.isComponentInteraction() ||
    context.isModelSubmitInteraction()
  ) {
    context.reply({
      embeds: [
        {
          color: client.config.colors.error,
          ...embed,
        },
      ],
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
    // biome-ignore lint/style/noUselessElse:
  } else if (a < b) {
    return "lower";
    // biome-ignore lint/style/noUselessElse:
  } else if (a === b) {
    return "same";
    // biome-ignore lint/style/noUselessElse:
  } else {
    return "unknown";
  }
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

  client.rest.webhooks.execute(credentials[type].ID, credentials[type].Token, {
    ...profile,
    ...options,
  });
}

export function handleError(
  error: Error,
  context: AnyInteractionGateway,
  language: string,
): void {
  const id = DiscordSnowflake.generate().toString();
  const payload: CreateMessageOptions = {
    embeds: [
      {
        author: {
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        },
        description: client.locales.__({
          phrase: "general.error.message",
          locale: language,
        }),
        fields: [
          {
            name: client.locales.__({
              phrase: "general.error.field",
              locale: language,
            }),
            value: `\`\`\`ansi\n${formatString(
              client.locales.__mf(
                {
                  phrase: "general.error.value",
                  locale: language,
                },
                {
                  id: id,
                  name: error.name,
                },
              ),
              "∷",
            )}\`\`\``,
          },
        ],
        color: client.config.colors.error,
      },
    ],
  };

  webhook(WebhookType.Logs, {
    content: "<@&1165278800842600601>",
    embeds: [
      {
        author: {
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        },
        description: `\`\`\`js\n${trim(error.stack as string, 4000)}\`\`\``,
        fields: [
          {
            name: "**General information**",
            value: `\`\`\`ansi\n${formatString(
              `Report ID ∷ ${id}\nUser ∷ ${context.user.username}\nUser ID ∷ ${context.user.id}\nServer ∷ ${context.guild?.name}\nServer ID ∷ ${context.guild?.id}`,
              "∷",
            )}\`\`\``,
          },
        ],
        color: client.config.colors.error,
      },
    ],
  });

  if (context.isCommandInteraction() || context.isCommandInteraction()) {
    context.reply(payload);
  }
}
