import { client } from "../..";
import { version } from "../../../package.json";

export default {
  COMMANDS: {
    CONFIG: {
      LANGUAGE: {
        MESSAGE: `**${client.config.emojis.SUCCESS} El idioma ha sido establecido a \`Español\`**`,
      },
      TIMEZONE: {
        ERRORS: {
          TIMEZONE_NOT_FOUND: (variables: { timezone: string }): string =>
            `**${client.config.emojis.MARK} La zona horaria \`${variables.timezone}\` no ha sido encontrada**`,
        },
        MESSAGE: (variables: { timezone: string }): string =>
          `**${client.config.emojis.SUCCESS} La zona horaria ha sido establecida a \`${variables.timezone}\`**`,
      },
    },
    INFO: {
      BOT: {
        MESSAGE: {
          FIELD_1: "**Información General**",
          VALUE_1: (variables: { uptime: string }): string =>
            [
              `${client.config.emojis.RIGHT} **Versión**: ${version}`,
              `${client.config.emojis.RIGHT} **Tiempo activo**: ${variables.uptime}`,
            ].join("\n"),
          FIELD_2: "**Estadísticas**",
          VALUE_2: (variables: {
            users: number;
            guilds: number;
            shards: number;
          }): string =>
            [
              `${client.config.emojis.RIGHT} **Usuarios**: ${variables.users} usuarios`,
              `${client.config.emojis.RIGHT} **Servidores**: ${variables.guilds} servidores`,
              `${client.config.emojis.RIGHT} **Shards**: ${variables.shards} shards`,
            ].join("\n"),
          FIELD_3: "**Proceso**",
          VALUE_3: (variables: {
            library: string;
            language: string;
            memory: string;
          }): string =>
            [
              `${client.config.emojis.RIGHT} **Librería**: ${variables.library}`,
              `${client.config.emojis.RIGHT} **Lenguaje**: ${variables.language}`,
              `${client.config.emojis.RIGHT} **Uso de RAM**: ${variables.memory}`,
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
              `${client.config.emojis.RIGHT} **Nombre**: ${variables.name}`,
              `${client.config.emojis.RIGHT} **ID**: ${variables.id}`,
              `${client.config.emojis.RIGHT} **Propietario**: ${variables.owner}`,
              `${client.config.emojis.RIGHT} **Fecha de Creación**: ${variables.createdAt}`,
            ].join("\n"),
          FIELD_2: "**Statistics**",
          VALUE_2: (variables: {
            members: number;
            channels: number;
            roles: number;
          }): string =>
            [
              `${client.config.emojis.RIGHT} **Miembros**: ${variables.members} miembros`,
              `${client.config.emojis.RIGHT} **Canales**: ${variables.channels} canales`,
              `${client.config.emojis.RIGHT} **Roles**: ${variables.roles} roles`,
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
              `${client.config.emojis.RIGHT} **Usuario**: ${variables.name}`,
              `${client.config.emojis.RIGHT} **ID**: ${variables.id}`,
              `${client.config.emojis.RIGHT} **Fecha de Creación**: ${variables.createdAt}`,
              `${client.config.emojis.RIGHT} **Fecha de Membresía**: ${variables.joinedAt}`,
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
          LABEL: "Añadir a Discord",
        },
        SUPPORT_SERVER: {
          LABEL: "Servidor de Soporte",
        },
      },
      SELECT_MENU: {
        PLACEHOLDER: "Selecciona una categoría",
        OPTIONS: {
          CONFIGURATION: {
            LABEL: "Configuración",
            DESCRIPTION: "Configura funcionalidades del bot a tu gusto",
          },
          INFORMATION: {
            LABEL: "Información",
            DESCRIPTION: "Obtén información útil de usuarios o del servidor",
          },
          MODERATION: {
            LABEL: "Moderación",
            DESCRIPTION:
              "Utiliza herramientas para mantener tu comunidad segura",
          },
          UTILITY: {
            LABEL: "Útilidad",
            DESCRIPTION: "Utiliza comandos variados que sean útiles",
          },
        },
      },
    },
    MESSAGE: {
      MESSAGE: (variables: { mention: string }): string =>
        `**¡Hola! Soy ${variables.mention}, un bot que ofrece una experiencia minimalista y eficiente para tus comunidades de Discord**\n\nEstoy diseñado con la simplicidad en mente, brindando funcionalidades esenciales de manera fácil y moderna`,
    },
  },
  GENERAL: {
    INVALID_GUILD_PROPERTY: (variables: { structure: object }): string =>
      `**${client.config.emojis.MARK} La propiedad \`guild\` no está presente en la estructura \`${variables.structure.constructor.name}\`\n${client.config.emojis.RIGHT} Intenta volver a ejecutar la acción dentro de un servidor**`,
    INVALID_GUILD_MEMBER: `**${client.config.emojis.MARK} El usuario debe de ser miembro del servidor**`,
    USER_IS_LIMITED: (variables: { resets: string }): string =>
      `**${client.config.emojis.MARK} Estas ejecutando demasiadas acciones en poco tiempo\n${client.config.emojis.RIGHT} Has recibido un bloqueo que se reiniciará en \`${variables.resets}\`**`,
  },
};
