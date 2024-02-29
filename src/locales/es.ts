import { version } from "../../package.json";
import { Emojis } from "../util/constants";

export default {
  COMMANDS: {
    CONFIG: {
      LANGUAGE: {
        MESSAGE: `**${Emojis.SUCCESS} El idioma ha sido establecido a \`Español\`**`,
      },
      TIMEZONE: {
        ERRORS: {
          TIMEZONE_NOT_FOUND: (variables: { timezone: string }): string =>
            `**${Emojis.MARK} La zona horaria \`${variables.timezone}\` no ha sido encontrada**`,
        },
        MESSAGE: (variables: { timezone: string }): string =>
          `**${Emojis.SUCCESS} La zona horaria ha sido establecida a \`${variables.timezone}\`**`,
      },
    },
    INFO: {
      BOT: {
        MESSAGE: {
          FIELDS: [
            {
              FIELD: "**Información General**",
              VALUE: (variables: { uptime: string }): string =>
                [
                  `${Emojis.RIGHT} **Versión**: ${version}`,
                  `${Emojis.RIGHT} **Tiempo activo**: ${variables.uptime}`,
                ].join("\n"),
            },
            {
              FIELD: "**Estadísticas**",
              VALUE: (variables: {
                users: number;
                guilds: number;
                shards: number;
              }): string =>
                [
                  `${Emojis.RIGHT} **Usuarios**: ${variables.users} usuarios`,
                  `${Emojis.RIGHT} **Servidores**: ${variables.guilds} servidores`,
                  `${Emojis.RIGHT} **Shards**: ${variables.shards} shards`,
                ].join("\n"),
            },
            {
              FIELD: "**Proceso**",
              VALUE: (variables: {
                library: string;
                language: string;
                memory: string;
              }): string =>
                [
                  `${Emojis.RIGHT} **Librería**: ${variables.library}`,
                  `${Emojis.RIGHT} **Lenguaje**: ${variables.language}`,
                  `${Emojis.RIGHT} **Uso de RAM**: ${variables.memory}`,
                ].join("\n"),
            },
          ],
        },
      },
      SERVER: {
        MESSAGE: {
          FIELDS: [
            {
              FIELD: "**Información General**",
              VALUE: (variables: {
                name: string;
                id: string;
                owner: string;
                createdAt: string;
              }): string =>
                [
                  `${Emojis.RIGHT} **Nombre**: ${variables.name}`,
                  `${Emojis.RIGHT} **ID**: ${variables.id}`,
                  `${Emojis.RIGHT} **Propietario**: ${variables.owner}`,
                  `${Emojis.RIGHT} **Fecha de Creación**: ${variables.createdAt}`,
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
                  `${Emojis.RIGHT} **Miembros**: ${variables.members} miembros`,
                  `${Emojis.RIGHT} **Canales**: ${variables.channels} canales`,
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
              FIELD: "**Información General**",
              VALUE: (variables: {
                name: string;
                id: string;
                createdAt: string;
                joinedAt: string;
                booster: string;
              }): string =>
                [
                  `${Emojis.RIGHT} **Usuario**: ${variables.name}`,
                  `${Emojis.RIGHT} **ID**: ${variables.id}`,
                  `${Emojis.RIGHT} **Fecha de Creación**: ${variables.createdAt}`,
                  `${Emojis.RIGHT} **Fecha de Membresía**: ${variables.joinedAt}`,
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
          `**${Emojis.MARK} La ubicación \`${variables.location}\` no ha sido encontrada**`,
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
      `**${Emojis.MARK} La propiedad \`guild\` no está presente en la estructura \`${variables.structure.constructor.name}\`\n${Emojis.RIGHT} Intenta volver a ejecutar la acción dentro de un servidor**`,
    INVALID_GUILD_MEMBER: `**${Emojis.MARK} El usuario debe de ser miembro del servidor**`,
    USER_IS_LIMITED: (variables: { resets: string }): string =>
      `**${Emojis.MARK} Estas ejecutando demasiadas acciones en poco tiempo\n${Emojis.RIGHT} Has recibido un bloqueo que se reiniciará en \`${variables.resets}\`**`,
    PERMISSIONS: {
      GUILD: {
        USER: (variables: { permissions: string }): string =>
          `**${Emojis.MARK} No se ha podido realizar esta acción debido a que necesitas el permiso de ${variables.permissions} en el servidor**`,
        CLIENT: (variables: { permissions: string }): string =>
          `**${Emojis.MARK} No se ha podido realizar esta acción debido a que necesito el permiso de ${variables.permissions} en el servidor**`,
      },
      CHANNEL: {
        USER: (variables: { permissions: string; channel: string }): string =>
          `**${Emojis.MARK} No se ha podido realizar esta acción debido a que necesitas el permiso de ${variables.permissions} en el canal ${variables.channel}**`,
        CLIENT: (variables: { permissions: string; channel: string }): string =>
          `**${Emojis.MARK} No se ha podido realizar esta acción debido a que necesito el permiso de ${variables.permissions} en el canal ${variables.channel}**`,
      },
    },
    SOMETHING_WENT_WRONG: {
      MESSAGE: (variables: { support: string }): string =>
        `**Algo salió mal mientras se ejecutaba esta operación**\nSi el error persiste, reporta el error con la ID proporcionada en nuestro [servidor de soporte](${variables.support})`,
      FIELDS: [
        {
          FIELD: "**Información General**",
          VALUE: (variables: { id: string; name: string }): string =>
            [
              `${Emojis.RIGHT} **ID del reporte**: ${variables.id}`,
              `${Emojis.RIGHT} **Nombre del Error**: ${variables.name}`,
            ].join("\n"),
        },
      ],
    },
  },
};
