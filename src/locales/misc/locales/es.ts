import { client } from "../../..";
import { version } from "../../../../package.json";

export default {
  COMMANDS: {
    INFO: {
      BOT: {
        MESSAGE: {
          FIELD_1: "**Información General**",
          VALUE_1: (variables: { uptime: string }): string =>
            [
              `${client.config.emojis.right} **Versión**: ${version}`,
              `${client.config.emojis.right} **Tiempo activo**: ${variables.uptime}`,
            ].join("\n"),
          FIELD_2: "**Estadísticas**",
          VALUE_2: (variables: {
            users: number;
            guilds: number;
            shards: number;
          }): string =>
            [
              `${client.config.emojis.right} **Usuarios**: ${variables.users} usuarios`,
              `${client.config.emojis.right} **Servidores**: ${variables.guilds} servidores`,
              `${client.config.emojis.right} **Shards**: ${variables.shards} shards`,
            ].join("\n"),
          FIELD_3: "**Proceso**",
          VALUE_3: (variables: {
            library: string;
            language: string;
            memory: string;
          }): string =>
            [
              `${client.config.emojis.right} **Librería**: ${variables.library}`,
              `${client.config.emojis.right} **Lenguaje**: ${variables.language}`,
              `${client.config.emojis.right} **Uso de RAM**: ${variables.memory}`,
            ].join("\n"),
        },
      },
      SERVER: {
        MESSAGE: {
          FIELD_1: "**Información General**",
          VALUE_1: (variables: {
            name: string;
            id: string;
            owner: string;
            createdAt: string;
          }): string =>
            [
              `${client.config.emojis.right} **Nombre**: ${variables.name}`,
              `${client.config.emojis.right} **ID**: ${variables.id}`,
              `${client.config.emojis.right} **Propietario**: ${variables.owner}`,
              `${client.config.emojis.right} **Fecha de Creación**: ${variables.createdAt}`,
            ].join("\n"),
          FIELD_2: "**Statistics**",
          VALUE_2: (variables: {
            members: number;
            channels: number;
            roles: number;
          }): string =>
            [
              `${client.config.emojis.right} **Miembros**: ${variables.members} miembros`,
              `${client.config.emojis.right} **Canales**: ${variables.channels} canales`,
              `${client.config.emojis.right} **Roles**: ${variables.roles} roles`,
            ].join("\n"),
        },
      },
      USER: {
        MESSAGE: {
          FIELD_1: "**Información General**",
          VALUE_1: (variables: {
            name: string;
            id: string;
            createdAt: string;
            joinedAt: string;
            booster: string;
          }): string =>
            [
              `${client.config.emojis.right} **Usuario**: ${variables.name}`,
              `${client.config.emojis.right} **ID**: ${variables.id}`,
              `${client.config.emojis.right} **Fecha de Creación**: ${variables.createdAt}`,
              `${client.config.emojis.right} **Fecha de Membresía**: ${variables.joinedAt}`,
              `${client.config.emojis.right} **Booster**: ${variables.booster}`,
            ].join("\n"),
        },
      },
    },
  },
  GENERAL: {
    INVALID_GUILD_PROPERTY: (variables: { structure: object }): string =>
      `**${client.config.emojis.mark} La propiedad \`guild\` no está presente en la estructura \`${variables.structure.constructor.name}\`\n${client.config.emojis.right} Intenta volver a ejecutar la acción dentro de un servidor**`,
    INVALID_GUILD_MEMBER: `**${client.config.emojis.mark} El usuario debe de ser miembro del servidor**`,
  },
};
