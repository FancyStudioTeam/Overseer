import { client } from "../..";
import { version } from "../../../package.json";

export default {
  COMMANDS: {
    CONFIG: {
      LANGUAGE: {
        MESSAGE: `**${client.config.emojis.SUCCESS} The language has been set to \`English\`**`,
      },
      TIMEZONE: {
        ERRORS: {
          TIMEZONE_NOT_FOUND: (variables: { timezone: string }): string =>
            `**${client.config.emojis.MARK} The timezone \`${variables.timezone}\` has not been found**`,
        },
        MESSAGE: (variables: { timezone: string }): string =>
          `**${client.config.emojis.SUCCESS} The timezone has been set to \`${variables.timezone}\`**`,
      },
    },
    INFO: {
      BOT: {
        MESSAGE: {
          FIELD_1: "**General Information**",
          VALUE_1: (variables: { uptime: string }): string =>
            [
              `${client.config.emojis.RIGHT} **Version**: ${version}`,
              `${client.config.emojis.RIGHT} **Uptime**: ${variables.uptime}`,
            ].join("\n"),
          FIELD_2: "**Statistics**",
          VALUE_2: (variables: {
            users: number;
            guilds: number;
            shards: number;
          }): string =>
            [
              `${client.config.emojis.RIGHT} **Users**: ${variables.users} users`,
              `${client.config.emojis.RIGHT} **Servers**: ${variables.guilds} servers`,
              `${client.config.emojis.RIGHT} **Shards**: ${variables.shards} shards`,
            ].join("\n"),
          FIELD_3: "**Process**",
          VALUE_3: (variables: {
            library: string;
            language: string;
            memory: string;
          }): string =>
            [
              `${client.config.emojis.RIGHT} **Library**: ${variables.library}`,
              `${client.config.emojis.RIGHT} **Language**: ${variables.language}`,
              `${client.config.emojis.RIGHT} **RAM Usage**: ${variables.memory}`,
            ].join("\n"),
        },
      },
      SERVER: {
        MESSAGE: {
          FIELD_1: "**General Information**",
          VALUE_1: (variables: {
            name: string;
            id: string;
            owner: string;
            createdAt: string;
          }): string =>
            [
              `${client.config.emojis.RIGHT} **Name**: ${variables.name}`,
              `${client.config.emojis.RIGHT} **ID**: ${variables.id}`,
              `${client.config.emojis.RIGHT} **Owner**: ${variables.owner}`,
              `${client.config.emojis.RIGHT} **Creation Date**: ${variables.createdAt}`,
            ].join("\n"),
          FIELD_2: "**Statistics**",
          VALUE_2: (variables: {
            members: number;
            channels: number;
            roles: number;
          }): string =>
            [
              `${client.config.emojis.RIGHT} **Members**: ${variables.members} members`,
              `${client.config.emojis.RIGHT} **Channels**: ${variables.channels} channels`,
              `${client.config.emojis.RIGHT} **Roles**: ${variables.roles} roles`,
            ].join("\n"),
        },
      },
      USER: {
        MESSAGE: {
          FIELD_1: "**General Information**",
          VALUE_1: (variables: {
            name: string;
            id: string;
            createdAt: string;
            joinedAt: string;
            booster: string;
          }): string =>
            [
              `${client.config.emojis.RIGHT} **User**: ${variables.name}`,
              `${client.config.emojis.RIGHT} **ID**: ${variables.id}`,
              `${client.config.emojis.RIGHT} **Creation Date**: ${variables.createdAt}`,
              `${client.config.emojis.RIGHT} **Membership Date**: ${variables.joinedAt}`,
              `${client.config.emojis.RIGHT} **Booster**: ${variables.booster}`,
            ].join("\n"),
        },
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
      `**${client.config.emojis.MARK} The \`guild\` property is not present in the \`${variables.structure.constructor.name}\` structure\n${client.config.emojis.RIGHT} Attempts to re-execute the action within a server**`,
    INVALID_GUILD_MEMBER: `**${client.config.emojis.MARK} The user must be a member of the server**`,
  },
};
