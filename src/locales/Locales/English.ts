import colors from "@colors/colors";
import { codeBlock, inlineCodeBlock } from "@sapphire/utilities";
import type { PermissionName } from "oceanic.js";
import { Emojis } from "#constants";
import { padding } from "#util/Util.js";

export default {
  COMMANDS: {
    INFORMATION: {
      BOT: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**${name} Information**`,
          FIELD_1: {
            FIELD: "**General Information**",
            VALUE: ({ version, memory }: { version: string; memory: string }) =>
              [
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Version**: ${version}`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **RAM Usage**: ${memory}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Statistics**",
            VALUE: ({ users, guilds, shards }: { users: number; guilds: number; shards: number }) =>
              [
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Users**: ${users} users`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Servers**: ${guilds} servers`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Shards**: ${shards} shards`,
              ].join("\n"),
          },
          FIELD_3: {
            FIELD: "**Last Reset Date**",
          },
        },
      },
      HELP: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**${name} Help Panel**`,
          FIELD_1: {
            FIELD: ({ command }: { command: string }) => `**${inlineCodeBlock(`/${command}`)} Subcommands**`,
          },
        },
      },
      PING: {
        MESSAGE_1: {
          DESCRIPTION_1: ({ rest, shard }: { rest: string; shard: string }) =>
            codeBlock(
              "ansi",
              padding(
                [
                  `${colors.reset.cyan("REST Reference")} - ${colors.bold.magenta(rest)}`,
                  `${colors.reset.cyan("WebSocket Connection")} - ${colors.bold.magenta(shard)}`,
                ].join("\n"),
                "-",
              ),
            ),
        },
      },
      SERVER: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**${name} Information**`,
          FIELD_1: {
            FIELD: "**General Information**",
            VALUE: ({ name, id, owner }: { name: string; id: string; owner: string }) =>
              [
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Name**: ${name}`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **ID**: ${id}`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Owner**: ${owner}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Statistics**",
            VALUE: ({ members, channels, roles }: { members: number; channels: number; roles: number }) =>
              [
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Members**: ${members} members`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Channels**: ${channels} channels`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Roles**: ${roles} roles`,
              ].join("\n"),
          },
          FIELD_3: {
            FIELD: "**Creation Date**",
          },
        },
      },
      USER: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**${name} Information**`,
          FIELD_1: {
            FIELD: "**General Information**",
            VALUE: ({ name, id }: { name: string; id: string }) =>
              [`${Emojis.EXPAND_CIRCLE_RIGHT} **User**: ${name}`, `${Emojis.EXPAND_CIRCLE_RIGHT} **ID**: ${id}`].join(
                "\n",
              ),
          },
          FIELD_2: {
            FIELD: "**Creation Date**",
          },
          FIELD_3: {
            FIELD: "**Membership Date**",
          },
        },
      },
    },
    MODERATION: {
      BAN: {
        MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
          [
            `**${Emojis.CHECK_CIRCLE_COLOR} The user ${user} has been banned by ${moderator}**`,
            `${Emojis.EXPAND_CIRCLE_RIGHT} **Reason**: ${reason}`,
          ].join("\n"),
      },
      KICK: {
        MESSAGE_1: ({ username, moderator, reason }: { username: string; moderator: string; reason: string }) =>
          [
            `**${Emojis.CHECK_CIRCLE_COLOR} The user ${username} has been kicked by ${moderator}**`,
            `${Emojis.EXPAND_CIRCLE_RIGHT} **Reason**: ${reason}`,
          ].join("\n"),
      },
      SOFTBAN: {
        MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
          [
            `**${Emojis.CHECK_CIRCLE_COLOR} The user ${user} has been softbanned by ${moderator}**`,
            `${Emojis.EXPAND_CIRCLE_RIGHT} **Reason**: ${reason}`,
          ].join("\n"),
      },
      PURGE: {
        INVALID_AMOUNT: `**${Emojis.CANCEL_CIRCLE_COLOR} The number of messages must be greater than 1 and less than 100**`,
        NO_MESSAGES: `**${Emojis.CANCEL_CIRCLE_COLOR} There are no messages to delete**`,
        SUCCESS_MESSAGE: ({ count }: { count: number }) =>
          `**${Emojis.CHECK_CIRCLE_COLOR} Successfully deleted ${count} messages**`,
      },
      TIMEOUT: {
        ADD: {
          INVALID_DURATION_FORMAT: `**${Emojis.CANCEL_CIRCLE_COLOR} The duration returned an invalid format**`,
          ALLOWED_DURATION_VALUES: `**${Emojis.CANCEL_CIRCLE_COLOR} The duration must be greater than or equal to 5 seconds and less than or equal to 28 days**`,
          MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
            [
              `**${Emojis.CHECK_CIRCLE_COLOR} The moderator ${moderator} has added a timeout for user ${user}**`,
              `${Emojis.EXPAND_CIRCLE_RIGHT} **Reason**: ${reason}`,
            ].join("\n"),
        },
        REMOVE: {
          USER_NOT_TIMEOUTED: `**${Emojis.CANCEL_CIRCLE_COLOR} The user does not have a timeout**`,
          MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
            [
              `**${Emojis.CHECK_CIRCLE_COLOR} The moderator ${moderator} has removed the timeout of the user ${user}**`,
              `${Emojis.EXPAND_CIRCLE_RIGHT} **Reason**: ${reason}`,
            ].join("\n"),
        },
      },
      UNBAN: {
        BAN_NOT_FOUND: ({ ban }: { ban: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} The ban ${inlineCodeBlock(ban)} has not been found**`,
        MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
          [
            `**${Emojis.CHECK_CIRCLE_COLOR} The user ${user} has been unbanned by ${moderator}**`,
            `${Emojis.EXPAND_CIRCLE_RIGHT} **Reason**: ${reason}`,
          ].join("\n"),
      },
    },
    UTILITY: {
      SUGGEST: {
        COMPONENTS: {
          BUTTONS: {
            MANAGE: {
              REPORT: {
                LABEL: "Report",
              },
            },
            STATUS: {
              APPROVE: {
                LABEL: "Approve",
              },
              DENY: {
                LABEL: "Deny",
              },
            },
          },
        },
        SYSTEM_NOT_ENABLED: `**${Emojis.CANCEL_CIRCLE_COLOR} The suggestion system is not enabled**`,
        SUGGESTIONS_NOT_FOUND: `**${Emojis.CANCEL_CIRCLE_COLOR} The suggestions channel has not been found**`,
        REVIEW_NOT_FOUND: `**${Emojis.CANCEL_CIRCLE_COLOR} The review channel has not been found**`,
        SUGGESTION_NOT_FOUND: ({ id }: { id: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} The suggestion ${inlineCodeBlock(id)} has not been found**`,
        MESSAGE_1: {
          TITLE_1: ({ username }: { username: string }) => `**${username} Suggestion**`,
          FIELD_1: {
            FIELD: ({ moderator }: { moderator: string }) => `**Comment by ${moderator}**`,
          },
          FIELD_2: {
            FIELD: ({ moderator }: { moderator: string }) => `**Suggestion approved by ${moderator}**`,
          },
          FIELD_3: {
            FIELD: ({ moderator }: { moderator: string }) => `**Suggestion denied by ${moderator}**`,
          },
        },
        MESSAGE_2: `**${Emojis.ERROR} This suggestion requires approval before being made public**`,
      },
    },
  },
  GLOBAL: {
    INVALID_GUILD_PROPERTY: ({ structure }: { structure: object }) =>
      [
        `**${Emojis.CANCEL_CIRCLE_COLOR} The ${inlineCodeBlock("guild")} property is not present in the ${inlineCodeBlock(
          structure.constructor.name,
        )} structure**`,
        `${Emojis.EXPAND_CIRCLE_RIGHT} Attempts to re-execute the action within a server`,
      ].join("\n"),
    INVALID_GUILD_MEMBER: `**${Emojis.CANCEL_CIRCLE_COLOR} The user must be a member of this server**`,
    USER_IS_LIMITED: ({ resets }: { resets: string }) =>
      [
        `**${Emojis.CANCEL_CIRCLE_COLOR} You are executing too many actions in too little time**`,
        `${Emojis.EXPAND_CIRCLE_RIGHT} You have received a block which will be reset in ${resets}`,
      ].join("\n"),
    CANNOT_MODERATE_MEMBER: `**${Emojis.CANCEL_CIRCLE_COLOR} You cannot moderate this member**`,
    HIERARCHY: {
      USER: `**${Emojis.CANCEL_CIRCLE_COLOR} You cannot moderate a user with a hierarchy equal to or higher than your hierarchy**`,
      CLIENT: `**${Emojis.CANCEL_CIRCLE_COLOR} I cannot moderate a user with a hierarchy equal to or higher than the bot's hierarchy**`,
    },
    PERMISSIONS: {
      GUILD: {
        USER: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} This action could not be performed because you need the ${permissions} permission on the server**`,
        CLIENT: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} This action could not be performed because I need the ${permissions} permission on the server**`,
      },
      CHANNEL: {
        USER: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} This action could not be performed because you need the ${permissions} permission on the channel ${channel}**`,
        CLIENT: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} This action could not be performed because I need the ${permissions} permission on the channel ${channel}**`,
      },
    },
    SOMETHING_WENT_WRONG: {
      COMPONENTS: {
        BUTTONS: {
          SUPPORT: {
            LABEL: "Support Server",
          },
        },
      },
      MESSAGE_1: ({ name, id }: { name: string; id: string }) =>
        [
          `**${Emojis.CANCEL_CIRCLE_COLOR} The server returned an error of type ${inlineCodeBlock(name)}**`,
          `${Emojis.EXPAND_CIRCLE_RIGHT} **Report ID**: ${id}`,
        ].join("\n"),
    },
    ONLY_GUILD_OWNER: `**${Emojis.CANCEL_CIRCLE_COLOR} This action can only be performed by the owner of the server**`,
    INVALID_USER_COLLECTOR: `**${Emojis.CANCEL_CIRCLE_COLOR} You cannot run this component**`,
  },
  PERMISSIONS: permissions(),
};

function permissions(): Record<PermissionName, string> {
  return {
    CREATE_INSTANT_INVITE: "Create Instant Invite",
    KICK_MEMBERS: "Kick Members",
    BAN_MEMBERS: "Ban Members",
    ADMINISTRATOR: "Administrator",
    MANAGE_CHANNELS: "Manage Channels",
    MANAGE_GUILD: "Manage Server",
    ADD_REACTIONS: "Add Reactions",
    VIEW_AUDIT_LOG: "View Audit Log",
    PRIORITY_SPEAKER: "Priority Speaker",
    STREAM: "Share Screen",
    VIEW_CHANNEL: "View Channel",
    SEND_MESSAGES: "Send Messages",
    SEND_TTS_MESSAGES: "Send TTS Messages",
    MANAGE_MESSAGES: "Manage Messages",
    EMBED_LINKS: "Embed Links",
    ATTACH_FILES: "Attach Files",
    READ_MESSAGE_HISTORY: "Read Message History",
    MENTION_EVERYONE: "Mention Everyone",
    USE_EXTERNAL_EMOJIS: "Use External Emojis",
    VIEW_GUILD_INSIGHTS: "View Server Insights",
    CONNECT: "Connect",
    SPEAK: "Speak",
    MUTE_MEMBERS: "Mute Members",
    DEAFEN_MEMBERS: "Deafen Members",
    MOVE_MEMBERS: "Move Members",
    USE_VAD: "Use VAD",
    CHANGE_NICKNAME: "Change Nickname",
    MANAGE_NICKNAMES: "Manage Nicknames",
    MANAGE_ROLES: "Manage Roles",
    MANAGE_WEBHOOKS: "Manage Webhooks",
    MANAGE_GUILD_EXPRESSIONS: "Manage Server Expressions",
    USE_APPLICATION_COMMANDS: "Use Application Commands",
    REQUEST_TO_SPEAK: "Request to Speak",
    MANAGE_EVENTS: "Manage Events",
    MANAGE_THREADS: "Manage Threads",
    CREATE_PUBLIC_THREADS: "Create Public Threads",
    CREATE_PRIVATE_THREADS: "Create Private Threads",
    USE_EXTERNAL_STICKERS: "Use External Stickers",
    SEND_MESSAGES_IN_THREADS: "Send Messages in Threads",
    USE_EMBEDDED_ACTIVITIES: "Use Embedded Activities",
    MODERATE_MEMBERS: "Moderate Members",
    VIEW_CREATOR_MONETIZATION_ANALYTICS: "View Creator Monetization Analytics",
    USE_SOUNDBOARD: "Use Soundboard",
    CREATE_GUILD_EXPRESSIONS: "Create Server Expressions",
    CREATE_EVENTS: "Create Events",
    USE_EXTERNAL_SOUNDS: "Use External Sounds",
    SEND_VOICE_MESSAGES: "Send Voice Messages",
    USE_CLYDE_AI: "Use Clyde AI",
    SET_VOICE_CHANNEL_STATUS: "Set Voice Channel Status",
    SEND_POLLS: "Send Polls",
    USE_EXTERNAL_APPS: "Use External Apps",
  };
}
