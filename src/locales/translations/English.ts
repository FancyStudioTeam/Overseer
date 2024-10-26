import colors from "@colors/colors";
import { Emojis } from "@constants";
import { bold, codeBlock, inlineCode } from "@discordjs/formatters";
import type { PermissionName } from "oceanic.js";

const permissions: Record<PermissionName, string> = {
  ADD_REACTIONS: "Add Reactions",
  ADMINISTRATOR: "Administrator",
  ATTACH_FILES: "Attach Files",
  BAN_MEMBERS: "Ban Members",
  CHANGE_NICKNAME: "Change Nickname",
  CONNECT: "Connect",
  CREATE_EVENTS: "Create Events",
  CREATE_GUILD_EXPRESSIONS: "Create Server Expressions",
  CREATE_INSTANT_INVITE: "Create Instant Invite",
  CREATE_PRIVATE_THREADS: "Create Private Threads",
  CREATE_PUBLIC_THREADS: "Create Public Threads",
  DEAFEN_MEMBERS: "Deafen Members",
  EMBED_LINKS: "Embed Links",
  KICK_MEMBERS: "Kick Members",
  MANAGE_CHANNELS: "Manage Channels",
  MANAGE_EVENTS: "Manage Events",
  MANAGE_GUILD: "Manage Server",
  MANAGE_GUILD_EXPRESSIONS: "Manage Server Expressions",
  MANAGE_MESSAGES: "Manage Messages",
  MANAGE_NICKNAMES: "Manage Nicknames",
  MANAGE_ROLES: "Manage Roles",
  MANAGE_THREADS: "Manage Threads",
  MANAGE_WEBHOOKS: "Manage Webhooks",
  MENTION_EVERYONE: "Mention Everyone",
  MODERATE_MEMBERS: "Moderate Members",
  MOVE_MEMBERS: "Move Members",
  MUTE_MEMBERS: "Mute Members",
  PRIORITY_SPEAKER: "Priority Speaker",
  READ_MESSAGE_HISTORY: "Read Message History",
  REQUEST_TO_SPEAK: "Request to Speak",
  SEND_MESSAGES: "Send Messages",
  SEND_MESSAGES_IN_THREADS: "Send Messages in Threads",
  SEND_POLLS: "Send Polls",
  SEND_TTS_MESSAGES: "Send TTS Messages",
  SEND_VOICE_MESSAGES: "Send Voice Messages",
  SET_VOICE_CHANNEL_STATUS: "Set Voice Channel Status",
  SPEAK: "Speak",
  STREAM: "Share Screen",
  USE_APPLICATION_COMMANDS: "Use Application Commands",
  USE_CLYDE_AI: "Use Clyde AI",
  USE_EMBEDDED_ACTIVITIES: "Use Embedded Activities",
  USE_EXTERNAL_APPS: "Use External Apps",
  USE_EXTERNAL_EMOJIS: "Use External Emojis",
  USE_EXTERNAL_SOUNDS: "Use External Sounds",
  USE_EXTERNAL_STICKERS: "Use External Stickers",
  USE_SOUNDBOARD: "Use Soundboard",
  USE_VAD: "Use VAD",
  VIEW_AUDIT_LOG: "View Audit Log",
  VIEW_CHANNEL: "View Channel",
  VIEW_CREATOR_MONETIZATION_ANALYTICS: "View Creator Monetization Analytics",
  VIEW_GUILD_INSIGHTS: "View Server Insights",
};

export default {
  COMMANDS: {
    CONFIGURATION: {
      AUTOMATIONS: {
        CREATE: {
          ERROR_WHILE_PARSING: ({
            errorMessage,
          }: {
            errorMessage: string;
          }) =>
            [bold(`${Emojis.CANCEL} An error has occurred while parsing the file`), codeBlock("ts", errorMessage)].join(
              "\n",
            ),
          MAXIMUM_SIZE_ALLOWED: ({
            maximum,
          }: {
            maximum: number;
          }) =>
            [
              bold(`${Emojis.CANCEL} The automation has exceeded the allowed size limit`),
              bold(
                `${Emojis.ARROW_CIRCLE_RIGHT} The size limit allowed per automation is ${inlineCode(maximum.toString())}`,
              ),
            ].join("\n"),
          MAXIMUM_AUTOMATIONS_ALLOWED: ({
            maximum,
          }: {
            maximum: number;
          }) =>
            [
              bold(`${Emojis.CANCEL} The server has exceeded the limit of allowed automations`),
              bold(
                `${Emojis.ARROW_CIRCLE_RIGHT} The limit of allowed automations per server is ${inlineCode(maximum.toString())}`,
              ),
            ].join("\n"),
          MESSAGE_1: ({
            automationName,
          }: {
            automationName: string;
          }) => bold(`${Emojis.CHECK_CIRCLE} The automation ${inlineCode(automationName)} has been created`),
        },
        DELETE: {
          AUTOMATION_NOT_FOUND: ({
            automationId,
          }: {
            automationId: string;
          }) => bold(`${Emojis.CANCEL} The automation ${inlineCode(automationId)} has not been found`),
          MESSAGE_1: ({
            automationName,
          }: {
            automationName: string;
          }) => bold(`${Emojis.CHECK_CIRCLE} The automation ${inlineCode(automationName)} has been deleted`),
        },
        LIST: {
          NO_AVAILABLE_AUTOMATIONS: bold(`${Emojis.CANCEL} This server has no automations available`),
        },
      },
      LANGUAGE: {
        MESSAGE_1: bold(`${Emojis.CHECK_CIRCLE} The bot language has been set to ${inlineCode("English")}`),
      },
      MEMBERSHIP: {
        REEDEM: {
          MEMBERSHIP_NOT_FOUND: ({
            membershipId,
          }: {
            membershipId: string;
          }) => bold(`${Emojis.CANCEL} The membership ${inlineCode(membershipId)} has not been found`),
          MESSAGE_1: ({
            membershipId,
          }: {
            membershipId: string;
          }) => bold(`${Emojis.CHECK_CIRCLE} The membership ${inlineCode(membershipId)} has been reedemed`),
        },
      },
    },
    INFORMATION: {
      DEBUG: {
        MESSAGE_1: {
          TITLE_1: "Debugging Information",
          DESCRIPTION_1: ({
            guilds,
            users,
          }: {
            guilds: number;
            users: number;
          }) =>
            codeBlock(
              "ansi",
              [`${colors.magenta("Servers:")} ${guilds}`, `${colors.magenta("Users:")} ${users}`].join("\n"),
            ),
        },
      },
    },
  },
  GLOBAL: {
    USER_IS_LIMITED: ({
      resets,
    }: {
      resets: string;
    }) =>
      bold(
        `${Emojis.CANCEL} Your maximum number of interactions has been limited\n${Emojis.ARROW_CIRCLE_RIGHT} The limit will be reestablished within ${resets}`,
      ),
    PERMISSIONS: {
      GUILD: {
        USER: ({
          permissions,
        }: {
          permissions: string;
        }) =>
          bold(
            `${Emojis.CANCEL} This action could not be performed because you need the ${permissions} permission on the server`,
          ),
        CLIENT: ({
          permissions,
        }: {
          permissions: string;
        }) =>
          bold(
            `${Emojis.CANCEL} This action could not be performed because I need the ${permissions} permission on the server`,
          ),
      },
      CHANNEL: {
        USER: ({
          permissions,
          channel,
        }: {
          permissions: string;
          channel: string;
        }) =>
          bold(
            `${Emojis.CANCEL} This action could not be performed because you need the ${permissions} permission on the channel ${channel}`,
          ),
        CLIENT: ({
          permissions,
          channel,
        }: {
          permissions: string;
          channel: string;
        }) =>
          bold(
            `${Emojis.CANCEL} This action could not be performed because I need the ${permissions} permission on the channel ${channel}`,
          ),
      },
    },
    INVALID_USER_COLLECTOR: bold(`${Emojis.CANCEL} You cannot run this component`),
  },
  PERMISSIONS: permissions,
};
