import colors from "@colors/colors";
import { escapeMarkdown } from "@discordjs/formatters";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { Timestamp } from "@sapphire/time-utilities";
import { type Awaitable, type Nullish, cutText, inlineCodeBlock } from "@sapphire/utilities";
import { captureException } from "@sentry/node";
import { ActionRow, Button, Embed } from "oceanic-builders";
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
import { Colors, Emojis, Links } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import type { Locales } from "#types";

export async function fetchUser({
  type,
  userID,
}: {
  type: FetchFrom;
  userID: string;
}): Promise<User | Nullish> {
  return match(type)
    .returnType<Awaitable<User | Nullish>>()
    .with(FetchFrom.DEFAULT, async () => client.users.get(userID) ?? (await client.rest.users.get(userID)))
    .with(FetchFrom.CACHE, () => client.users.get(userID))
    .with(FetchFrom.REST, async () => await client.rest.users.get(userID))
    .otherwise(() => undefined);
}

export async function fetchMember({
  guild,
  memberID,
  type,
}: {
  guild: Guild;
  memberID: string;
  type: FetchFrom;
}): Promise<Member | Nullish> {
  return match(type)
    .returnType<Awaitable<Member | Nullish>>()
    .with(
      FetchFrom.DEFAULT,
      async () => guild.members.get(memberID) ?? (await client.rest.guilds.getMember(guild.id, memberID)),
    )
    .with(FetchFrom.CACHE, () => guild.members.get(memberID))
    .with(FetchFrom.REST, async () => await client.rest.guilds.getMember(guild.id, memberID))
    .otherwise(() => undefined);
}

export function sanitizeString({
  content,
  options,
}: {
  content: string;
  options: {
    maxLength?: number;
    shouldEscapeMarkdown?: boolean;
    shouldReplaceLinks?: boolean;
  };
}): string {
  let sanitizedContent = content;

  if (options.shouldEscapeMarkdown) {
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

  if (options.shouldReplaceLinks) {
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

export async function errorMessage({
  context,
  message,
  shouldBeEphemeral = true,
}: {
  context: AnyInteractionGateway | Message;
  message: string;
  shouldBeEphemeral?: boolean;
}): Promise<void> {
  const payload: CreateMessageOptions & InteractionContent = {
    embeds: new Embed().setDescription(message).setColor(Colors.RED).toJSON(true),
    flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  "reply" in context
    ? await context.reply(payload)
    : await client.rest.channels.createMessage(context.channelID, payload);
}

export function parseEmoji(emoji: string): NullablePartialEmoji {
  const match = emoji.match(/(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,20})/);

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

export async function disableMessageComponents(message: Message): Promise<void> {
  for (const row of message.components) {
    for (const component of row.components) {
      component.disabled = true;
    }
  }

  await client.rest.channels.editMessage(message.channelID, message.id, {
    components: message.components,
  });
}

export function compareMemberToMember({
  from,
  to,
}: {
  from: Member;
  to: Member;
}): ComparationLevel {
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

export function formatTimestamp({
  date,
  long,
  use12Hours,
}: {
  date: Date | string;
  long?: boolean;
  use12Hours?: boolean;
}): string {
  return new Timestamp(
    long ? (use12Hours ? "DD/MM/YYYY[, ]hh:mm:ss A" : "DD/MM/YYYY[, ]HH:mm:ss") : "DD/MM/YYYY",
  ).display(date);
}

export function formatUnix({
  date,
  type,
}: {
  date: Date;
  type: UnixType;
}): string {
  const unix: Record<UnixType, string> = {
    [UnixType.SHORT_TIME]: "t",
    [UnixType.SHORT_DATE]: "d",
    [UnixType.RELATIVE]: "R",
    [UnixType.SHORT_DATE_TIME]: "f",
    [UnixType.LONG_DATE_TIME]: "F",
    [UnixType.LONG_TIME]: "T",
    [UnixType.LONG_DATE]: "D",
  };

  return `<t:${Math.floor(date.getTime() / 1000)}:${unix[type]}>`;
}

export function search<T extends AvailableSearchTypes>({
  options,
  query,
}: {
  options: T[];
  query: string;
}): T[] {
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

export async function checkPermissions({
  channel,
  context,
  locale,
  member,
  permissionsToCheck,
  shouldBeEphemeral,
  type,
}: {
  channel?: AnyTextableGuildChannel;
  context: AnyInteractionGateway | Message;
  locale: Locales;
  member: Member;
  permissionsToCheck: PermissionName[];
  shouldBeEphemeral?: boolean;
  type: CheckPermissionsFrom;
}): Promise<boolean> {
  let hasPermissions = true;

  if (!(context.inCachedGuildChannel() && context.guild)) return false;

  const clientOrUser = member.id === client.user.id ? "CLIENT" : "USER";
  const channelOrGuild = type === CheckPermissionsFrom.CHANNEL ? "CHANNEL" : "GUILD";
  const missingPermissions = permissionsToCheck.filter((permission) =>
    channelOrGuild === "CHANNEL"
      ? !channel?.permissionsOf(member).has(permission)
      : !member.permissions.has(permission),
  );
  const payload: CreateMessageOptions & InteractionContent = {
    embeds: new Embed()
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
      .setColor(Colors.RED)
      .toJSON(true),
    flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  if (missingPermissions.length > 0) {
    hasPermissions = false;

    "reply" in context
      ? await context.reply(payload)
      : await client.rest.channels.createMessage(context.channelID, payload);
  }

  return hasPermissions;
}

export function logger({
  content,
  type,
}: {
  content: string;
  type: LoggerType;
}): void {
  const array = (elements: string[]): string[] => ["", ...elements, ""];
  const spaces = (content: string, max: number): string => {
    const spaces = " ".repeat(max);

    return [spaces, content, spaces].join("");
  };
  const timestamp = spaces(
    formatTimestamp({
      date: new Date().toLocaleString("en-US", {
        timeZone: "Europe/Madrid",
      }),
    }),
    1,
  );
  const levels: Record<LoggerType, string> = {
    [LoggerType.ERROR]: colors.brightRed(
      [array([timestamp, spaces("ERR", 1)]).join(colors.bgBrightRed(" ")), content].join(" "),
    ),
    [LoggerType.DEBUG]: colors.brightMagenta(
      [array([timestamp, spaces("DBG", 1)]).join(colors.bgBrightMagenta(" ")), content].join(" "),
    ),
    [LoggerType.WARN]: colors.brightYellow(
      [array([timestamp, spaces("WRN", 1)]).join(colors.bgBrightYellow(" ")), content].join(" "),
    ),
    [LoggerType.INFO]: colors.brightBlue(
      [array([timestamp, spaces("INF", 1)]).join(colors.bgBrightBlue(" ")), content].join(" "),
    ),
    [LoggerType.REQUEST]: colors.brightCyan(
      [array([timestamp, spaces("REQ", 1)]).join(colors.bgBrightCyan(" ")), content].join(" "),
    ),
  };

  console.log(levels[type]);
}

export async function handleError({
  context,
  error,
  locale,
}: {
  context: AnyInteractionGateway | Message;
  error: Error;
  locale: Locales;
}): Promise<void> {
  captureException(error);
  logger({
    content: error.stack ?? error.message,
    type: LoggerType.ERROR,
  });

  const id = DiscordSnowflake.generate().toString();
  const payload: CreateMessageOptions & InteractionContent = {
    embeds: new Embed()
      .setDescription(
        Translations[locale].GLOBAL.SOMETHING_WENT_WRONG.MESSAGE_1({
          name: error.name,
          id,
        }),
      )
      .setColor(Colors.RED)
      .toJSON(true),
    components: new ActionRow()
      .addComponents([
        new Button()
          .setLabel(Translations[locale].GLOBAL.SOMETHING_WENT_WRONG.COMPONENTS.BUTTONS.SUPPORT.LABEL)
          .setStyle(ButtonStyles.LINK)
          .setEmoji(parseEmoji(Emojis.LIFE_BUOY))
          .setURL(Links.SUPPORT),
      ])
      .toJSON(true),
  };

  "reply" in context
    ? await context.reply(payload)
    : await client.rest.channels.createMessage(context.channelID, payload);
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

export enum FetchFrom {
  DEFAULT,
  CACHE,
  REST,
}
