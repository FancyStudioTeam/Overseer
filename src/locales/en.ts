import { version } from "../../package.json";
import { Emojis } from "../util/constants";

export default {
  COMMANDS: {
    CONFIG: {
      LANGUAGE: {
        MESSAGE: `**${Emojis.SUCCESS} The language has been set to \`English\`**`,
      },
      TIMEZONE: {
        ERRORS: {
          TIMEZONE_NOT_FOUND: (variables: { timezone: string }): string =>
            `**${Emojis.MARK} The timezone \`${variables.timezone}\` has not been found**`,
        },
        MESSAGE: (variables: { timezone: string }): string =>
          `**${Emojis.SUCCESS} The timezone has been set to \`${variables.timezone}\`**`,
      },
    },
    INFO: {
      BOT: {
        MESSAGE: {
          FIELDS: [
            {
              FIELD: "**General Information**",
              VALUE: (variables: { uptime: string }): string =>
                [
                  `${Emojis.RIGHT} **Version**: ${version}`,
                  `${Emojis.RIGHT} **Uptime**: ${variables.uptime}`,
                ].join("\n"),
            },
            {
              FIELD: "**Statistics**",
              VALUE: (variables: {
                users: number;
                guilds: number;
                shards: number;
              }): string =>
                [
                  `${Emojis.RIGHT} **Users**: ${variables.users} users`,
                  `${Emojis.RIGHT} **Servers**: ${variables.guilds} servers`,
                  `${Emojis.RIGHT} **Shards**: ${variables.shards} shards`,
                ].join("\n"),
            },
            {
              FIELD: "**Process**",
              VALUE: (variables: {
                library: string;
                language: string;
                memory: string;
              }): string =>
                [
                  `${Emojis.RIGHT} **Library**: ${variables.library}`,
                  `${Emojis.RIGHT} **Language**: ${variables.language}`,
                  `${Emojis.RIGHT} **RAM Usage**: ${variables.memory}`,
                ].join("\n"),
            },
          ],
        },
      },
      SERVER: {
        MESSAGE: {
          FIELDS: [
            {
              FIELD: "**General Information**",
              VALUE: (variables: {
                name: string;
                id: string;
                owner: string;
                createdAt: string;
              }): string =>
                [
                  `${Emojis.RIGHT} **Name**: ${variables.name}`,
                  `${Emojis.RIGHT} **ID**: ${variables.id}`,
                  `${Emojis.RIGHT} **Owner**: ${variables.owner}`,
                  `${Emojis.RIGHT} **Creation Date**: ${variables.createdAt}`,
                ].join("\n"),
            },
            {
              FIELD: "**Statistics**",
              VALUE: (variables: {
                members: number;
                channels: number;
                roles: number;
              }): string =>
                [
                  `${Emojis.RIGHT} **Members**: ${variables.members} members`,
                  `${Emojis.RIGHT} **Channels**: ${variables.channels} channels`,
                  `${Emojis.RIGHT} **Roles**: ${variables.roles} roles`,
                ].join("\n"),
            },
          ],
        },
      },
      USER: {
        MESSAGE: {
          FIELDS: [
            {
              FIELD: "**General Information**",
              VALUE: (variables: {
                name: string;
                id: string;
                createdAt: string;
                joinedAt: string;
                booster: string;
              }): string =>
                [
                  `${Emojis.RIGHT} **User**: ${variables.name}`,
                  `${Emojis.RIGHT} **ID**: ${variables.id}`,
                  `${Emojis.RIGHT} **Creation Date**: ${variables.createdAt}`,
                  `${Emojis.RIGHT} **Membership Date**: ${variables.joinedAt}`,
                  `${Emojis.RIGHT} **Booster**: ${variables.booster}`,
                ].join("\n"),
            },
          ],
        },
      },
    },
    UTIL: {
      WEATHER: {
        LOCATION_NOT_FOUND: (variables: { location: string }): string =>
          `**${Emojis.MARK} The location \`${variables.location}\` has not been found**`,
      },
    },
  },
  HELP: {
    COMPONENTS: {
      BUTTONS: {
        ADD_TO_DISCORD: {
          LABEL: "Add to Discord",
        },
        SUPPORT_SERVER: {
          LABEL: "Support Server",
        },
      },
      SELECT_MENU: {
        PLACEHOLDER: "Select a category",
        OPTIONS: {
          CONFIGURATION: {
            LABEL: "Configuration",
            DESCRIPTION: "Configure bot functionalities to your liking",
          },
          INFORMATION: {
            LABEL: "Information",
            DESCRIPTION: "Get useful information from users or the server",
          },
          MODERATION: {
            LABEL: "Moderation",
            DESCRIPTION: "Use tools to keep your community safe",
          },
          UTILITY: {
            LABEL: "Utility",
            DESCRIPTION: "Use a variety of useful commands",
          },
        },
      },
    },
    MESSAGE: {
      MESSAGE: (variables: { mention: string }): string =>
        `**Hello! I am ${variables.mention}, a bot that offers a minimalist and efficient experience for your Discord communities**\n\nI am designed with simplicity in mind, providing essential functionalities in an easy and modern manner`,
    },
  },
  GENERAL: {
    INVALID_GUILD_PROPERTY: (variables: { structure: object }): string =>
      `**${Emojis.MARK} The \`guild\` property is not present in the \`${variables.structure.constructor.name}\` structure\n${Emojis.RIGHT} Attempts to re-execute the action within a server**`,
    INVALID_GUILD_MEMBER: `**${Emojis.MARK} The user must be a member of the server**`,
    USER_IS_LIMITED: (variables: { resets: string }): string =>
      `**${Emojis.MARK} You are executing too many actions in too little time\n${Emojis.RIGHT} You have received a block which will be reset in \`${variables.resets}\`**`,
    PERMISSIONS: {
      GUILD: {
        USER: (variables: { permissions: string }): string =>
          `**${Emojis.MARK} This action could not be performed because you need the ${variables.permissions} permission on the server**`,
        CLIENT: (variables: { permissions: string }): string =>
          `**${Emojis.MARK} This action could not be performed because I need the ${variables.permissions} permission on the server**`,
      },
      CHANNEL: {
        USER: (variables: { permissions: string; channel: string }): string =>
          `**${Emojis.MARK} This action could not be performed because you need the ${variables.permissions} permission on the channel ${variables.channel}**`,
        CLIENT: (variables: { permissions: string; channel: string }): string =>
          `**${Emojis.MARK} This action could not be performed because I need the ${variables.permissions} permission on the channel ${variables.channel}**`,
      },
    },
    SOMETHING_WENT_WRONG: {
      MESSAGE: (variables: { support: string }): string =>
        `**Something went wrong while executing this operation**\nIf the error persists, report the error with the ID provided on our [support server](${variables.support})`,
      FIELDS: [
        {
          FIELD: "**General Information**",
          VALUE: (variables: { id: string; name: string }): string =>
            [
              `${Emojis.RIGHT} **Report ID**: ${variables.id}`,
              `${Emojis.RIGHT} **Error Name**: ${variables.name}`,
            ].join("\n"),
        },
      ],
    },
  },
};
