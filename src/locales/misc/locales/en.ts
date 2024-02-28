import { client } from "../../..";
import { version } from "../../../../package.json";

export default {
  COMMANDS: {
    INFO: {
      BOT: {
        MESSAGE: {
          FIELD_1: "**General Information**",
          VALUE_1: (variables: { uptime: string }): string =>
            [
              `${client.config.emojis.right} **Version**: ${version}`,
              `${client.config.emojis.right} **Uptime**: ${variables.uptime}`,
            ].join("\n"),
          FIELD_2: "**Statistics**",
          VALUE_2: (variables: {
            users: number;
            guilds: number;
            shards: number;
          }): string =>
            [
              `${client.config.emojis.right} **Users**: ${variables.users} users`,
              `${client.config.emojis.right} **Servers**: ${variables.guilds} servers`,
              `${client.config.emojis.right} **Shards**: ${variables.shards} shards`,
            ].join("\n"),
          FIELD_3: "**Process**",
          VALUE_3: (variables: {
            library: string;
            language: string;
            memory: string;
          }): string =>
            [
              `${client.config.emojis.right} **Library**: ${variables.library}`,
              `${client.config.emojis.right} **Language**: ${variables.language}`,
              `${client.config.emojis.right} **RAM Usage**: ${variables.memory}`,
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
              `${client.config.emojis.right} **Name**: ${variables.name}`,
              `${client.config.emojis.right} **ID**: ${variables.id}`,
              `${client.config.emojis.right} **Owner**: ${variables.owner}`,
              `${client.config.emojis.right} **Creation Date**: ${variables.createdAt}`,
            ].join("\n"),
          FIELD_2: "**Statistics**",
          VALUE_2: (variables: {
            members: number;
            channels: number;
            roles: number;
          }): string =>
            [
              `${client.config.emojis.right} **Members**: ${variables.members} members`,
              `${client.config.emojis.right} **Channels**: ${variables.channels} channels`,
              `${client.config.emojis.right} **Roles**: ${variables.roles} roles`,
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
              `${client.config.emojis.right} **User**: ${variables.name}`,
              `${client.config.emojis.right} **ID**: ${variables.id}`,
              `${client.config.emojis.right} **Creation Date**: ${variables.createdAt}`,
              `${client.config.emojis.right} **Membership Date**: ${variables.joinedAt}`,
              `${client.config.emojis.right} **Booster**: ${variables.booster}`,
            ].join("\n"),
        },
      },
    },
  },
  GENERAL: {
    INVALID_GUILD_PROPERTY: (variables: { structure: object }): string =>
      `**${client.config.emojis.mark} The \`guild\` property is not present in the \`${variables.structure.constructor.name}\` structure\n${client.config.emojis.right} Attempts to re-execute the action within a server**`,
    INVALID_GUILD_MEMBER: `**${client.config.emojis.mark} The user must be a member of the server**`,
  },
};
