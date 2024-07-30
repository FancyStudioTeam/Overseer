import { inlineCodeBlock } from "@sapphire/utilities";
import type { PermissionName, UserFlags } from "oceanic.js";
import { Emojis } from "#constants";

export default {
  GLOBAL: {
    INVALID_GUILD_PROPERTY: ({ structure }: { structure: object }) =>
      [
        `**${Emojis.CIRCLE_X_COLOR} The ${inlineCodeBlock("guild")} property is not present in the ${inlineCodeBlock(
          structure.constructor.name,
        )} structure**`,
        `${Emojis.CIRCLE_CHEVRON_RIGHT} Attempts to re-execute the action within a server`,
      ].join("\n"),
    INVALID_GUILD_MEMBER: `**${Emojis.CIRCLE_X_COLOR} The user must be a member of this server**`,
    USER_IS_LIMITED: ({ resets }: { resets: string }) =>
      [
        `**${Emojis.CIRCLE_X_COLOR} You are executing too many actions in too little time**`,
        `${Emojis.CIRCLE_CHEVRON_RIGHT} You have received a block which will be reset in ${resets}`,
      ].join("\n"),
    CANNOT_MODERATE_MEMBER: `**${Emojis.CIRCLE_X_COLOR} You cannot moderate this member**`,
    HIERARCHY: {
      USER: `**${Emojis.CIRCLE_X_COLOR} You cannot moderate a user with a hierarchy equal to or higher than your hierarchy**`,
      CLIENT: `**${Emojis.CIRCLE_X_COLOR} I cannot moderate a user with a hierarchy equal to or higher than the bot's hierarchy**`,
    },
    PERMISSIONS: {
      GUILD: {
        USER: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CIRCLE_X_COLOR} This action could not be performed because you need the ${permissions} permission on the server**`,
        CLIENT: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CIRCLE_X_COLOR} This action could not be performed because I need the ${permissions} permission on the server**`,
      },
      CHANNEL: {
        USER: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CIRCLE_X_COLOR} This action could not be performed because you need the ${permissions} permission on the channel ${channel}**`,
        CLIENT: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CIRCLE_X_COLOR} This action could not be performed because I need the ${permissions} permission on the channel ${channel}**`,
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
          `**${Emojis.CIRCLE_X_COLOR} The server returned an error of type ${inlineCodeBlock(name)}**`,
          `${Emojis.CIRCLE_CHEVRON_RIGHT} **Report ID**: ${id}`,
        ].join("\n"),
    },
    ONLY_GUILD_OWNER: `**${Emojis.CIRCLE_X_COLOR} This action can only be performed by the owner of the server**`,
    INVALID_USER_COLLECTOR: `**${Emojis.CIRCLE_X_COLOR} You cannot run this component**`,
  },
  PERMISSIONS: permissions(),
  USER_FLAGS: userFlags(),
};

function permissions(): Record<PermissionName, string> {
  return {
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
}

function userFlags(): Record<UserFlags, string> {
  return {
    1: "Discord Staff",
    2: "Partenered Server Owner",
    4: "Hype Squad Events",
    8: "Discord Bug Hunter Tier 1",
    16: "MFA SMS",
    32: "Premium Promo Dismissed",
    64: "Hype Squad Bravery",
    128: "Hype Squad Brilliance",
    256: "Hype Squad Balance",
    512: "Early Supporter",
    1024: "Pseudo Team User",
    2048: "Internal Application",
    4096: "System",
    8192: "Has Unread Urgent Messages",
    16384: "Discord Bug Hunter Tier 2",
    32768: "Underage Deleted",
    65536: "Verified App",
    131072: "Early Verified Bot Developer",
    262144: "Moderator Programs Alumni",
    524288: "HTTP Interactions",
    1048576: "Spammer",
    2097152: "Disable Premium",
    4194304: "Active Developer",
    8589934592: "High Global Rate Limit",
    17179869184: "Deleted",
    34359738368: "Disable Suspicious Activity",
    68719476736: "Self Deleted",
    137438953472: "Premium Discriminator",
    274877906944: "Used Desktop Client",
    549755813888: "Used Web Client",
    1099511627776: "Used Mobile Client",
    2199023255552: "Disabled",
    8796093022208: "Verified Email",
    17592186044416: "Quarintined",
    1125899906842624: "Collaborator",
    2251799813685248: "Restricted Collaborator",
  };
}
