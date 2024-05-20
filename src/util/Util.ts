import colors from "@colors/colors";
import { ParsedCustomEmojiWithGroups } from "@sapphire/discord-utilities";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { Timestamp } from "@sapphire/time-utilities";
import type { Nullish } from "@sapphire/utilities";
import { captureException } from "@sentry/node";
import {
  type AnyInteractionGateway,
  type AnyTextableGuildChannel,
  type CreateMessageOptions,
  type EmbedOptions,
  type InteractionContent,
  type Member,
  type Message,
  MessageFlags,
  type NullablePartialEmoji,
  type PermissionName,
  type Role,
  type User,
} from "oceanic.js";
import urlRegex from "url-regex-safe";
import { _client } from "..";
import { Colors, Links } from "../Constants";
import { EmbedBuilder } from "../builders/Embed";
import { Translations } from "../locales";
import { Permissions } from "../locales/misc/Reference";
import type { Locales } from "../types";

export async function fetchUser(id: string): Promise<User | Nullish> {
  const user = _client.users.has(id)
    ? _client.users.get(id)
    : await _client.rest.users.get(id).catch(() => null);

  return user;
}

export async function fetchMember(
  context: AnyInteractionGateway | Message,
  id: string
): Promise<Member | Nullish> {
  if (!(context.inCachedGuildChannel() && context.guild)) return null;

  const member = context.guild.members.has(id)
    ? context.guild.members.get(id)
    : await _client.rest.guilds
        .getMember(context.guild.id, id)
        .catch(() => null);

  return member;
}

export function padding(content: string, separator: string): string {
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

    lines[i] = parts.join(` ${separator} `);
  }

  return lines.join("\n");
}

export async function errorMessage(
  main: {
    _context: AnyInteractionGateway | Message;
    ephemeral?: boolean;
  },
  embed: EmbedOptions
): Promise<void> {
  const payload: CreateMessageOptions & InteractionContent = {
    embeds: new EmbedBuilder().load(embed).setColor(Colors.ERROR).toJSONArray(),
    flags: main.ephemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  "reply" in main._context
    ? await main._context.reply(payload)
    : await _client.rest.channels
        .createMessage(main._context.channelID, payload)
        .catch(() => null);
}

export function cleanContent(content: string): string {
  let message = content;
  const elements = message.match(
    urlRegex({
      strict: false,
    })
  );

  if (elements) {
    // biome-ignore lint/style/useForOf:
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

export function getHighestRole(member: Member): Role {
  const roles: Role[] = [<Role>member.guild.roles.get(member.guildID)];

  member.roles.forEach((id, _) => {
    const role = member.guild.roles.get(id);

    if (role) {
      roles.push(role);
    }
  });

  return roles.sort((a, b) => b.position - a.position)[0];
}

export async function disableComponents(message: Message): Promise<void> {
  message.components.forEach((r, _) => {
    r.components.forEach((c, _) => {
      c.disabled = true;
    });
  });

  await _client.rest.channels
    .editMessage(message.channelID, message.id, {
      components: message.components,
    })
    .catch(() => null);
}

export function compareMemberToMember(
  from: Member,
  to: Member
): ComparationLevel {
  const a = getHighestRole(from).position ?? -1;
  const b = getHighestRole(to).position ?? -1;

  if (a > b) {
    return ComparationLevel.HIGHER;
  }

  if (a < b) {
    return ComparationLevel.LOWER;
  }

  if (a === b) {
    return ComparationLevel.EQUAL;
  }

  return ComparationLevel.UNKNOWN;
}

export function formatTimestamp(
  date: Date | string,
  hour12 = false,
  long = true
): string {
  return new Timestamp(
    long
      ? hour12
        ? "DD/MM/YYYY[, ]hh:mm:ss A"
        : "DD/MM/YYYY[, ]HH:mm:ss"
      : "DD/MM/YYYY"
  ).display(date);
}

export function formatUnix(type: UnixType, date: Date): string {
  return `<t:${Math.floor(date.getTime() / 1_000)}:${<Record<UnixType, string>>(
    (<unknown>{
      [UnixType.SHORT_TIME]: "t",
      [UnixType.SHORT_DATE]: "d",
      [UnixType.RELATIVE]: "R",
      [UnixType.SHORT_DATE_TIME]: "f",
      [UnixType.LONG_DATE_TIME]: "F",
    }[type])
  )}>`;
}

export function search<T extends AvailableSearchTypes>(
  query: string,
  options: T[]
): T[] {
  const choices: T[] = [];
  const updatedQuery = query.toLowerCase();

  if (options.every((element) => typeof element === "string")) {
    // biome-ignore lint/style/useForOf:
    for (let i = 0; i < options.length; i++) {
      if (options[i].toLowerCase().includes(updatedQuery)) {
        choices.push(options[i]);
      }
    }
  }

  return choices;
}

export async function checkPermissions(
  main: {
    _context: AnyInteractionGateway | Message;
    locale: Locales;
    ephemeral?: boolean;
  },
  type: CheckPermissionsFrom,
  checkPermissions: PermissionName[],
  member: Member,
  channel?: AnyTextableGuildChannel
): Promise<boolean> {
  const requiredPermissions: PermissionName[] = [];
  let hasPermissions = true;

  if (!(main._context.inCachedGuildChannel() && main._context.guild))
    return false;

  checkPermissions.forEach((p, _) => {
    if (
      type === CheckPermissionsFrom.GUILD
        ? !member.permissions.has(p)
        : !channel?.permissionsOf(member).has(p)
    ) {
      requiredPermissions.push(p);
    }
  });

  const payload: CreateMessageOptions & InteractionContent = {
    embeds: new EmbedBuilder()
      .setDescription(
        member.user.id === _client.user.id
          ? Translations[main.locale].GENERAL.PERMISSIONS.GUILD.CLIENT({
              permissions: requiredPermissions
                .map((p, _) => {
                  return `\`${Permissions[main.locale][p]}\``;
                })
                .join(", "),
            })
          : Translations[main.locale].GENERAL.PERMISSIONS.GUILD.USER({
              permissions: requiredPermissions
                .map((p, _) => {
                  return `\`${Permissions[main.locale][p]}\``;
                })
                .join(", "),
            })
      )
      .setColor(Colors.ERROR)
      .toJSONArray(),
    flags: main.ephemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  if (
    requiredPermissions.length && type === CheckPermissionsFrom.GUILD
      ? !member.permissions.has(...requiredPermissions)
      : !channel?.permissionsOf(member).has(...requiredPermissions)
  ) {
    hasPermissions = false;

    "reply" in main._context
      ? await main._context.reply(payload)
      : await _client.rest.channels
          .createMessage(main._context.channelID, payload)
          .catch(() => null);
  }

  return hasPermissions;
}

export function logger(type: LoggerType, content: string): void {
  console.log(
    `[${colors.grey(
      formatTimestamp(
        new Date().toLocaleString("en-US", {
          timeZone: "Europe/Madrid",
        })
      )
    )}] [${<Record<LoggerType, string>>(<unknown>{
      [LoggerType.ERROR]: colors.brightRed("ERR"),
      [LoggerType.DEBUG]: colors.brightMagenta("DBG"),
      [LoggerType.WARN]: colors.brightYellow("WRN"),
      [LoggerType.INFO]: colors.brightBlue("INF"),
      [LoggerType.REQUEST]: colors.brightCyan("REQ"),
      [LoggerType.MISC]: colors.white("MSC"),
    }[type])}] ${content}`
  );
}

export async function handleError(
  main: {
    _context: AnyInteractionGateway | Message;
    locale: Locales;
  },
  error: Error
): Promise<void> {
  captureException(error);
  logger(LoggerType.ERROR, error.stack ?? error.message);

  const id = DiscordSnowflake.generate().toString();
  const payload: CreateMessageOptions & InteractionContent = {
    embeds: new EmbedBuilder()
      .setTitle(Translations[main.locale].GENERAL.SOMETHING_WENT_WRONG.TITLE_1)
      .setDescription(
        Translations[main.locale].GENERAL.SOMETHING_WENT_WRONG.DESCRIPTION_1({
          support: Links.SUPPORT,
        })
      )
      .addFields([
        {
          name: Translations[main.locale].GENERAL.SOMETHING_WENT_WRONG.FIELD_1
            .FIELD,
          value: Translations[
            main.locale
          ].GENERAL.SOMETHING_WENT_WRONG.FIELD_1.VALUE({
            id,
            name: error.name,
          }),
        },
      ])
      .setColor(Colors.ERROR)
      .toJSONArray(),
  };

  "reply" in main._context
    ? await main._context.reply(payload)
    : await _client.rest.channels
        .createMessage(main._context.channelID, payload)
        .catch(() => null);
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

export type AvailableSearchTypes = string;

export enum CheckPermissionsFrom {
  GUILD,
  CHANNEL,
}

export enum LoggerType {
  ERROR,
  DEBUG,
  WARN,
  INFO,
  REQUEST,
  MISC,
}

export enum ComparationLevel {
  UNKNOWN,
  LOWER,
  EQUAL,
  HIGHER,
}

export enum UnixType {
  SHORT_TIME,
  SHORT_DATE,
  RELATIVE,
  SHORT_DATE_TIME,
  LONG_DATE_TIME,
}
