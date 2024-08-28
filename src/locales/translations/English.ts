import colors from "@colors/colors";
import { codeBlock } from "@discordjs/formatters";
import type { PermissionName } from "oceanic.js";
import { Emojis } from "#constants";

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
    PERMISSIONS: {
      GUILD: {
        USER: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CANCEL} This action could not be performed because you need the ${permissions} permission on the server**`,
        CLIENT: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CANCEL} This action could not be performed because I need the ${permissions} permission on the server**`,
      },
      CHANNEL: {
        USER: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CANCEL} This action could not be performed because you need the ${permissions} permission on the channel ${channel}**`,
        CLIENT: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CANCEL} This action could not be performed because I need the ${permissions} permission on the channel ${channel}**`,
      },
    },
    ONLY_GUILD_OWNER: `**${Emojis.CANCEL} This action can only be performed by the owner of the server**`,
    INVALID_USER_COLLECTOR: `**${Emojis.CANCEL} You cannot run this component**`,
  },
  PERMISSIONS: permissions,
};
