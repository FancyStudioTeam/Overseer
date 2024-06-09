import colors from "@colors/colors";
import { escapeMarkdown } from "@discordjs/formatters";
import { ParsedCustomEmojiWithGroups } from "@sapphire/discord-utilities";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { Timestamp } from "@sapphire/time-utilities";
import { type Awaitable, type Nullish, cutText, inlineCodeBlock } from "@sapphire/utilities";
import { captureException } from "@sentry/node";
import { EmbedBuilder } from "oceanic-builders";
import { ButtonBuilder } from "oceanic-builders";
import {
  type AnyInteractionGateway,
  type AnyTextableGuildChannel,
  ButtonStyles,
  type CreateMessageOptions,
  type Guild,
  type InteractionContent,
  type Member,
  type Message,
  MessageFlags,
  type NullablePartialEmoji,
  type PermissionName,
  type Role,
  type User,
} from "oceanic.js";
import { match } from "ts-pattern";
import urlRegex from "url-regex-safe";
import { ActionRowBuilder } from "#builders";
import { Colors, Emojis, Links } from "#constants";
import { _client } from "#index";
import { Translations } from "#locales";
import type { Locales } from "#types";

export async function fetchUser(type: FetchFrom, id: string): Promise<User | Nullish> {
  return match(type)
    .returnType<Awaitable<User | Nullish>>()
    .with(FetchFrom.DEFAULT, async () => _client.users.get(id) ?? (await _client.rest.users.get(id)))
    .with(FetchFrom.CACHE, () => _client.users.get(id))
    .with(FetchFrom.REST, async () => await _client.rest.users.get(id))
    .otherwise(() => null);
}

export async function fetchMember(type: FetchFrom, guild: Guild, id: string): Promise<Member | Nullish> {
  return match(type)
    .returnType<Awaitable<Member | Nullish>>()
    .with(FetchFrom.DEFAULT, async () => guild.members.get(id) ?? (await _client.rest.guilds.getMember(guild.id, id)))
    .with(FetchFrom.CACHE, () => guild.members.get(id))
    .with(FetchFrom.REST, async () => await _client.rest.guilds.getMember(guild.id, id))
    .otherwise(() => null);
}

export function sanitizeString(content: string, options: SanitizeStringOptions): string {
  let sanitizedContent = content;

  if (options.espaceMarkdown) {
    const escapeDiscordMarkdown = () => {
      return escapeMarkdown(sanitizedContent, {
        bold: true,
        bulletedList: true,
        codeBlock: true,
        codeBlockContent: true,
        escape: true,
        heading: true,
        inlineCode: true,
        inlineCodeContent: true,
        italic: true,
        maskedLink: true,
        spoiler: true,
        strikethrough: true,
        underline: true,
      });
    };

    sanitizedContent = escapeDiscordMarkdown();
  }

  if (options.replaceLinks) {
    const replaceLinks = () => {
      const elements = sanitizedContent.match(
        urlRegex({
          strict: false,
        }),
      );

      if (elements) {
        for (const element of elements) {
          sanitizedContent = sanitizedContent.replace(element, element.replace(element, "**[Link Detected]**"));
        }
      }

      return sanitizedContent;
    };

    sanitizedContent = replaceLinks();
  }

  if (options.maxLength) {
    sanitizedContent = cutText(sanitizedContent, options.maxLength);
  }

  return sanitizedContent;
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

export async function errorMessage({
  _context,
  ephemeral,
  message,
}: {
  _context: AnyInteractionGateway | Message;
  ephemeral?: boolean;
  message: string;
}): Promise<void> {
  const payload: CreateMessageOptions & InteractionContent = {
    embeds: new EmbedBuilder().setDescription(message).setColor(Colors.ERROR).toJSONArray(),
    flags: ephemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  "reply" in _context
    ? await _context.reply(payload)
    : await _client.rest.channels.createMessage(_context.channelID, payload);
}

export function parseEmoji(emoji: string): NullablePartialEmoji {
  const match = emoji.match(ParsedCustomEmojiWithGroups);

  if (match) {
    return {
      name: match[2],
      id: match[3],
    };
  }

  return {};
}

export function getHighestRole(member: Member): Role {
  const roles: Role[] = [<Role>member.guild.roles.get(member.guildID)];

  for (const id of member.roles) {
    const role = member.guild.roles.get(id);

    if (role) {
      roles.push(role);
    }
  }

  return roles.sort((a, b) => b.position - a.position)[0];
}

export async function disableComponents(message: Message): Promise<void> {
  for (const row of message.components) {
    for (const component of row.components) {
      component.disabled = true;
    }
  }

  await _client.rest.channels.editMessage(message.channelID, message.id, {
    components: message.components,
  });
}

export function compareMemberToMember(from: Member, to: Member): ComparationLevel {
  const roleFrom = getHighestRole(from).position ?? -1;
  const roleTo = getHighestRole(to).position ?? -1;

  return match([roleFrom, roleTo])
    .returnType<ComparationLevel>()
    .with(
      [roleFrom, roleTo],
      ([from, to]) => from > to,
      () => ComparationLevel.HIGHER,
    )
    .with(
      [roleFrom, roleTo],
      ([from, to]) => from < to,
      () => ComparationLevel.LOWER,
    )
    .with(
      [roleFrom, roleTo],
      ([from, to]) => from === to,
      () => ComparationLevel.EQUAL,
    )
    .otherwise(() => ComparationLevel.UNKNOWN);
}

export function formatTimestamp(date: Date | string, hour12 = false, long = true): string {
  return new Timestamp(long ? (hour12 ? "DD/MM/YYYY[, ]hh:mm:ss A" : "DD/MM/YYYY[, ]HH:mm:ss") : "DD/MM/YYYY").display(
    date,
  );
}

export function formatUnix(type: UnixType, date: Date): string {
  const unix: Record<UnixType, string> = {
    [UnixType.SHORT_TIME]: "t",
    [UnixType.SHORT_DATE]: "d",
    [UnixType.RELATIVE]: "R",
    [UnixType.SHORT_DATE_TIME]: "f",
    [UnixType.LONG_DATE_TIME]: "F",
    [UnixType.LONG_TIME]: "T",
    [UnixType.LONG_DATE]: "D",
  };

  return `<t:${Math.floor(date.getTime() / 1_000)}:${unix[type]}>`;
}

export function search<T extends AvailableSearchTypes>(query: string, options: T[]): T[] {
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
  {
    _context,
    locale,
    ephemeral,
  }: {
    _context: AnyInteractionGateway | Message;
    locale: Locales;
    ephemeral?: boolean;
  },
  type: CheckPermissionsFrom,
  checkPermissions: PermissionName[],
  member: Member,
  channel?: AnyTextableGuildChannel,
): Promise<boolean> {
  let hasPermissions = true;

  if (!(_context.inCachedGuildChannel() && _context.guild)) return false;

  const clientOrUser = member.id === _client.user.id ? "CLIENT" : "USER";
  const channelOrGuild = type === CheckPermissionsFrom.CHANNEL ? "CHANNEL" : "GUILD";
  const missingPermissions = checkPermissions.filter((permission) =>
    channelOrGuild === "CHANNEL"
      ? !channel?.permissionsOf(member).has(permission)
      : !member.permissions.has(permission),
  );
  const payload: CreateMessageOptions & InteractionContent = {
    embeds: new EmbedBuilder()
      .setDescription(
        Translations[locale].GLOBAL.PERMISSIONS[channelOrGuild][clientOrUser]({
          permissions: missingPermissions
            .map((permission, _) => {
              return inlineCodeBlock(Translations[locale].PERMISSIONS[permission]);
            })
            .join(", "),
          channel: channel?.mention ?? "",
        }),
      )
      .setColor(Colors.ERROR)
      .toJSONArray(),
    flags: ephemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  if (missingPermissions.length) {
    hasPermissions = false;

    "reply" in _context
      ? await _context.reply(payload)
      : await _client.rest.channels.createMessage(_context.channelID, payload);
  }

  return hasPermissions;
}

export function logger(type: LoggerType, content: string): void {
  const level: Record<LoggerType, string> = {
    [LoggerType.ERROR]: colors.brightRed("ERR"),
    [LoggerType.DEBUG]: colors.brightMagenta("DBG"),
    [LoggerType.WARN]: colors.brightYellow("WRN"),
    [LoggerType.INFO]: colors.brightBlue("INF"),
    [LoggerType.REQUEST]: colors.brightCyan("REQ"),
    [LoggerType.MISC]: colors.white("MSC"),
  };

  console.log(
    `[${colors.grey(
      formatTimestamp(
        new Date().toLocaleString("en-US", {
          timeZone: "Europe/Madrid",
        }),
      ),
    )}] [${level[type]}] ${content}`,
  );
}

export async function handleError(
  {
    _context,
    locale,
  }: {
    _context: AnyInteractionGateway | Message;
    locale: Locales;
  },
  error: Error,
): Promise<void> {
  captureException(error);
  logger(LoggerType.ERROR, error.stack ?? error.message);

  const id = DiscordSnowflake.generate().toString();
  const payload: CreateMessageOptions & InteractionContent = {
    embeds: new EmbedBuilder()
      .setDescription(
        Translations[locale].GLOBAL.SOMETHING_WENT_WRONG.MESSAGE_1({
          name: error.name,
          id,
        }),
      )
      .setColor(Colors.ERROR)
      .toJSONArray(),
    components: new ActionRowBuilder()
      .addComponents([
        new ButtonBuilder()
          .setLabel(Translations[locale].GLOBAL.SOMETHING_WENT_WRONG.COMPONENTS.BUTTONS.SUPPORT.LABEL)
          .setStyle(ButtonStyles.LINK)
          .setEmoji(parseEmoji(Emojis.SUPPORT))
          .setURL(Links.SUPPORT),
      ])
      .toJSONArray(),
  };

  "reply" in _context
    ? await _context.reply(payload)
    : await _client.rest.channels.createMessage(_context.channelID, payload);
}

export function bitFieldValues(bitField: number): number[] {
  const fields = [];

  for (let i = 0; i < Math.log2(bitField) + 1; i++) {
    const power = 2 ** i;
    const result = bitField & power;

    if (result !== 0) {
      fields.push(result);
    }
  }

  return fields;
}

interface SanitizeStringOptions {
  maxLength?: number;
  espaceMarkdown?: boolean;
  replaceLinks?: boolean;
}

export type AvailableSearchTypes = string;

export enum FetchFrom {
  DEFAULT,
  CACHE,
  REST,
}

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
  LONG_TIME,
  LONG_DATE,
}
