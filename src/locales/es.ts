import { Emojis } from "../constants";
import { MembershipType } from "../types";

export default {
  COMMANDS: {
    CONFIG: {
      LANGUAGE: {
        MESSAGE_1: `**${Emojis.SUCCESS} El idioma ha sido establecido a \`Español\`**`,
      },
      PREMIUM: {
        CLAIM: {
          MEMBERSHIP_NOT_FOUND: (variables: { code: string }): string =>
            `**${Emojis.MARK} El código \`${variables.code}\` no ha sido encontrado**`,
          MESSAGE_1: (variables: {
            type: MembershipType;
            expireDate: string | undefined;
          }): string =>
            `**${Emojis.SUCCESS} La membresía premium ha sido reclamada**\n${
              Emojis.RIGHT
            } La membresía premium ${
              variables.type !== MembershipType.INFINITE
                ? `caducará el \`${variables.expireDate}\``
                : "`nunca caducará`"
            }`,
        },
        REVOKE: {
          COMPONENTS: {
            BUTTONS: {
              CONFIRM: {
                LABEL: "Confirmar",
                MESSAGE_1: `**${Emojis.SUCCESS} La membresía premium ha sido revocada**`,
              },
              CANCEL: {
                LABEL: "Cancelar",
              },
            },
          },
          INVALID_GUILD_MEMBERSHIP: `**${Emojis.MARK} El servidor no tiene una membresía premium**`,
          MESSAGE_1: `**${Emojis.WARNING} Estás a punto de cancelar tu membresía premium**\n${Emojis.RIGHT} Si lo haces, ya no podrás disfrutar de los beneficios de la membresía`,
        },
      },
      TIMEZONE: {
        ERRORS: {
          TIMEZONE_NOT_FOUND: (variables: { timezone: string }): string =>
            `**${Emojis.MARK} La zona horaria \`${variables.timezone}\` no ha sido encontrada**`,
        },
        MESSAGE_1: (variables: { timezone: string }): string =>
          `**${Emojis.SUCCESS} La zona horaria ha sido establecida a \`${variables.timezone}\`**`,
      },
    },
    INFO: {
      BOT: {
        MESSAGE_1: {
          FIELD_1: {
            FIELD: "**Información General**",
            VALUE: (variables: { version: string; uptime: string }): string =>
              [
                `${Emojis.RIGHT} **Versión**: ${variables.version}`,
                `${Emojis.RIGHT} **Tiempo activo**: ${variables.uptime}`,
              ].join("\n"),
          },
          FIELD_2: {
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
          FIELD_3: {
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
        },
      },
      SERVER: {
        MESSAGE_1: {
          FIELD_1: {
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
          FIELD_2: {
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
        },
      },
      USER: {
        MESSAGE_1: {
          FIELD_1: {
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
        },
      },
    },
    UTIL: {
      SUGGEST: {
        COMPONENTS: {
          BUTTONS: {
            MANAGE: {
              REPORT: {
                LABEL: "Reportar",
              },
            },
            STATUS: {
              APPROVE: {
                LABEL: "Aprobar",
              },
              DENY: {
                LABEL: "Denegar",
              },
            },
          },
        },
        SUGGESTIONS_NOT_FOUND: `**${Emojis.MARK} El canal de sugerencias no ha sido encontrado**`,
        REVIEW_NOT_FOUND: `**${Emojis.MARK} El canal de revisión no ha sido encontrado**`,
        MESSAGE_1: {
          FIELD_1: {
            FIELD: (variables: { moderator: string }): string =>
              `**Comentario de ${variables.moderator}**`,
          },
          FIELD_2: {
            FIELD: (variables: { moderator: string }): string =>
              `**Sugerencia aprobada por ${variables.moderator}**`,
          },
          FIELD_3: {
            FIELD: (variables: { moderator: string }): string =>
              `**Sugerencia denegada por ${variables.moderator}**`,
          },
        },
        MESSAGE_2: `**${Emojis.WARNING} Esta sugerencia está en revisión**\n${Emojis.RIGHT} Si apruebas la sugerencia, se enviará al canal de sugerencias. En caso contrario, se eliminará`,
      },
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
        PLUGINS: {
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
    },
    MESSAGE_1: {
      DESCRIPTION: (variables: { mention: string }): string =>
        `**¡Hola! Soy ${variables.mention}, un bot que ofrece una experiencia minimalista y eficiente para tus comunidades de Discord**\n\nEstoy diseñado con la simplicidad en mente, brindando funcionalidades esenciales de manera fácil y moderna`,
    },
  },
  GENERAL: {
    INVALID_GUILD_PROPERTY: (variables: { structure: object }): string =>
      `**${Emojis.MARK} La propiedad \`guild\` no está presente en la estructura \`${variables.structure.constructor.name}\`**\n${Emojis.RIGHT} Intenta volver a ejecutar la acción dentro de un servidor`,
    INVALID_GUILD_MEMBER: `**${Emojis.MARK} El usuario debe de ser miembro del servidor**`,
    USER_IS_LIMITED: (variables: { resets: string }): string =>
      `**${Emojis.MARK} Estas ejecutando demasiadas acciones en poco tiempo**\n${Emojis.RIGHT} Has recibido un bloqueo que se reiniciará en \`${variables.resets}\``,
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
      DESCRIPTION: (variables: { support: string }): string =>
        `**Algo salió mal mientras se ejecutaba esta operación**\nSi el error persiste, reporta el error con la ID proporcionada en nuestro [servidor de soporte](${variables.support})`,
      FIELD_1: {
        FIELD: "**Información General**",
        VALUE: (variables: { id: string; name: string }): string =>
          [
            `${Emojis.RIGHT} **ID del reporte**: ${variables.id}`,
            `${Emojis.RIGHT} **Nombre del Error**: ${variables.name}`,
          ].join("\n"),
      },
    },
    ONLY_GUILD_OWNER: `**${Emojis.MARK} Esta acción solamente la puede ejecutar el propietario del servidor**`,
    INVALID_USER_COLLECTOR: `**${Emojis.MARK} No puedes ejecutar los componentes de otro usuario**`,
  },
};
