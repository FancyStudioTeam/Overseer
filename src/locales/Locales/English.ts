import colors from "@colors/colors";
import { type Nullish, codeBlock } from "@sapphire/utilities";
import { isNullOrUndefined } from "@sapphire/utilities";
import { Emojis } from "#constants";
import { padding } from "#util";

export default {
  COMMANDS: {
    CONFIGURATION: {
      LANGUAGE: {
        MESSAGE_1: `**${Emojis.SUCCESS} The language has been set to \`English\`**`,
      },
      PREMIUM: {
        CLAIM: {
          MEMBERSHIP_NOT_FOUND: ({ code }: { code: string }) =>
            `**${Emojis.MARK} The code \`${code}\` has not been found**`,
          MESSAGE_1: ({ expireDate }: { expireDate: string | Nullish }) =>
            [
              `**${Emojis.SUCCESS} The premium membership has been claimed**`,
              `${Emojis.RIGHT} The premium membership will ${
                isNullOrUndefined(expireDate)
                  ? "`never expire`"
                  : `expire on \`${expireDate}\``
              }`,
            ].join("\n"),
        },
        REVOKE: {
          COMPONENTS: {
            BUTTONS: {
              CONFIRM: {
                LABEL: "Confirm",
                MESSAGE_1: `**${Emojis.SUCCESS} The premium membership has been revoked**`,
              },
              CANCEL: {
                LABEL: "Cancel",
                MESSAGE_1: `**${Emojis.SUCCESS} The revocation has been cancelled**`,
              },
            },
          },
          INVALID_GUILD_MEMBERSHIP: `**${Emojis.MARK} The server does not have a premium membership**`,
          MESSAGE_1: [
            `**${Emojis.WARNING} You are about to cancel the premium membership**`,
            `${Emojis.RIGHT} If you do so, you will no longer be able to enjoy the benefits of membership`,
          ].join("\n"),
        },
      },
      TIMEZONE: {
        ERRORS: {
          TIMEZONE_NOT_FOUND: ({ timezone }: { timezone: string }) =>
            `**${Emojis.MARK} The timezone \`${timezone}\` has not been found**`,
        },
        MESSAGE_1: ({ timezone }: { timezone: string }) =>
          `**${Emojis.SUCCESS} The timezone has been set to \`${timezone}\`**`,
      },
    },
    INFORMATION: {
      BOT: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**${name} Information**`,
          FIELD_1: {
            FIELD: "**General Information**",
            VALUE: ({ version, memory }: { version: string; memory: string }) =>
              [
                `${Emojis.RIGHT} **Version**: ${version}`,
                `${Emojis.RIGHT} **RAM Usage**: ${memory}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Statistics**",
            VALUE: ({
              users,
              guilds,
              shards,
            }: {
              users: number;
              guilds: number;
              shards: number;
            }) =>
              [
                `${Emojis.RIGHT} **Users**: ${users} users`,
                `${Emojis.RIGHT} **Servers**: ${guilds} servers`,
                `${Emojis.RIGHT} **Shards**: ${shards} shards`,
              ].join("\n"),
          },
          FIELD_3: {
            FIELD: "**Last Reset Date**",
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
                  `${colors.reset.cyan("REST Reference")} - ${colors.bold.magenta(
                    rest,
                  )}`,
                  `${colors.reset.cyan(
                    "WebSocket Connection",
                  )} - ${colors.bold.magenta(shard)}`,
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
            VALUE: ({
              name,
              id,
              owner,
            }: {
              name: string;
              id: string;
              owner: string;
            }) =>
              [
                `${Emojis.RIGHT} **Name**: ${name}`,
                `${Emojis.RIGHT} **ID**: ${id}`,
                `${Emojis.RIGHT} **Owner**: ${owner}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Statistics**",
            VALUE: ({
              members,
              channels,
              roles,
            }: {
              members: number;
              channels: number;
              roles: number;
            }) =>
              [
                `${Emojis.RIGHT} **Members**: ${members} members`,
                `${Emojis.RIGHT} **Channels**: ${channels} channels`,
                `${Emojis.RIGHT} **Roles**: ${roles} roles`,
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
              [
                `${Emojis.RIGHT} **User**: ${name}`,
                `${Emojis.RIGHT} **ID**: ${id}`,
              ].join("\n"),
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
      KICK: {
        CANNOT_MODERATE_MEMBER: `**${Emojis.MARK} You cannot moderate this member**`,
        USER_HIGHEST_ROLE: `**${Emojis.MARK} You cannot kick this user because they have a role equal to or higher than yours**`,
        MESSAGE_1: ({
          username,
          moderator,
        }: {
          username: string;
          moderator: string;
        }) =>
          `**${Emojis.SUCCESS} The user ${username} has been kicked by ${moderator}**`,
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
        SUGGESTIONS_NOT_FOUND: `**${Emojis.MARK} The suggestions channel has not been found**`,
        REVIEW_NOT_FOUND: `**${Emojis.MARK} The review channel has not been found**`,
        MESSAGE_1: {
          TITLE_1: ({ username }: { username: string }) =>
            `**${username} Suggestion**`,
          FIELD_1: {
            FIELD: ({ moderator }: { moderator: string }) =>
              `**Comment by ${moderator}**`,
          },
          FIELD_2: {
            FIELD: ({ moderator }: { moderator: string }) =>
              `**Suggestion approved by ${moderator}**`,
          },
          FIELD_3: {
            FIELD: ({ moderator }: { moderator: string }) =>
              `**Suggestion denied by ${moderator}**`,
          },
        },
      },
    },
  },
  HELP: {
    MESSAGE_1: {
      TITLE_1: ({ name }: { name: string }) => `**${name} Help Panel**`,
      FIELD_1: {
        FIELD: ({ command }: { command: string }) =>
          `**\`/${command}\` Subcommands**`,
      },
    },
  },
  GLOBAL: {
    INVALID_GUILD_PROPERTY: ({ structure }: { structure: object }) =>
      [
        `**${Emojis.MARK} The \`guild\` property is not present in the \`${structure.constructor.name}\` structure**`,
        `${Emojis.RIGHT} Attempts to re-execute the action within a server`,
      ].join("\n"),
    INVALID_GUILD_MEMBER: `**${Emojis.MARK} The user must be a member of the server**`,
    USER_IS_LIMITED: ({ resets }: { resets: string }) =>
      [
        `**${Emojis.MARK} You are executing too many actions in too little time**`,
        `${Emojis.RIGHT} You have received a block which will be reset in ${resets}`,
      ].join("\n"),
    PERMISSIONS: {
      GUILD: {
        USER: ({ permissions }: { permissions: string }) =>
          `**${Emojis.MARK} This action could not be performed because you need the ${permissions} permission on the server**`,
        CLIENT: ({ permissions }: { permissions: string }) =>
          `**${Emojis.MARK} This action could not be performed because I need the ${permissions} permission on the server**`,
      },
      CHANNEL: {
        USER: ({
          permissions,
          channel,
        }: {
          permissions: string;
          channel: string;
        }) =>
          `**${Emojis.MARK} This action could not be performed because you need the ${permissions} permission on the channel ${channel}**`,
        CLIENT: ({
          permissions,
          channel,
        }: {
          permissions: string;
          channel: string;
        }) =>
          `**${Emojis.MARK} This action could not be performed because I need the ${permissions} permission on the channel ${channel}**`,
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
          `**${Emojis.MARK} The server returned an error of type \`${name}\`**`,
          `${Emojis.RIGHT} **Report ID**: ${id}`,
        ].join("\n"),
    },
    ONLY_GUILD_OWNER: `**${Emojis.MARK} This action can only be performed by the owner of the server**`,
    INVALID_USER_COLLECTOR: `**${Emojis.MARK} You cannot run this component**`,
  },
};
