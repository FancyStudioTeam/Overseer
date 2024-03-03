import { Emojis } from "../constants";
import { MembershipType } from "../types";

export default {
  COMMANDS: {
    CONFIG: {
      LANGUAGE: {
        MESSAGE_1: `**${Emojis.SUCCESS} O idioma foi establecido a \`Gallego\`**`,
      },
      PREMIUM: {
        CLAIM: {
          MEMBERSHIP_NOT_FOUND: (variables: { code: string }): string =>
            `**${Emojis.MARK} O código \`${variables.code}\` non foi atopado**`,
          MESSAGE_1: (variables: {
            type: MembershipType;
            expireDate: string | undefined;
          }): string =>
            `**${Emojis.SUCCESS} A membresía premium foi reclamada**\n${
              Emojis.RIGHT
            } A membresía premium ${
              variables.type !== MembershipType.INFINITE
                ? `caducará o \`${variables.expireDate}\``
                : "`nunca caducará`"
            }`,
        },
        REVOKE: {
          COMPONENTS: {
            BUTTONS: {
              CONFIRM: {
                LABEL: "Confirmar",
                MESSAGE_1: `**${Emojis.SUCCESS} A membresía premium foi revogada**`,
              },
              CANCEL: {
                LABEL: "Cancelar",
              },
            },
          },
          INVALID_GUILD_MEMBERSHIP: `**${Emojis.MARK} O servidor non ten unha membresía premium**`,
          MESSAGE_1: `**${Emojis.WARNING} Estás a piques de cancelar o teu membresía premium**\n${Emojis.RIGHT} Se o fas, xa non poderás gozar dos beneficios da membresía`,
        },
      },
      TIMEZONE: {
        ERRORS: {
          TIMEZONE_NOT_FOUND: (variables: { timezone: string }): string =>
            `**${Emojis.MARK} A zona horaria \`${variables.timezone}\` non foi atopada**`,
        },
        MESSAGE_1: (variables: { timezone: string }): string =>
          `**${Emojis.SUCCESS} A zona horaria foi establecida a \`${variables.timezone}\`**`,
      },
    },
    INFO: {
      BOT: {
        MESSAGE_1: {
          FIELD_1: {
            FIELD: "**Información Xeral**",
            VALUE: (variables: { version: string; uptime: string }): string =>
              [
                `${Emojis.RIGHT} **Versión**: ${variables.version}`,
                `${Emojis.RIGHT} **Tempo activo**: ${variables.uptime}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Estatísticas**",
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
                `${Emojis.RIGHT} **Linguaxe**: ${variables.language}`,
                `${Emojis.RIGHT} **Uso de RAM**: ${variables.memory}`,
              ].join("\n"),
          },
        },
      },
      SERVER: {
        MESSAGE_1: {
          FIELD_1: {
            FIELD: "**Información Xeral**",
            VALUE: (variables: {
              name: string;
              id: string;
              owner: string;
              createdAt: string;
            }): string =>
              [
                `${Emojis.RIGHT} **Nome**: ${variables.name}`,
                `${Emojis.RIGHT} **IDE**: ${variables.id}`,
                `${Emojis.RIGHT} **Propietario**: ${variables.owner}`,
                `${Emojis.RIGHT} **Data de Creación**: ${variables.createdAt}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Estatísticas**",
            VALUE: (variables: {
              members: number;
              channels: number;
              roles: number;
            }): string =>
              [
                `${Emojis.RIGHT} **Membros**: ${variables.members} membros`,
                `${Emojis.RIGHT} **Canles**: ${variables.channels} canles`,
                `${Emojis.RIGHT} **Roles**: ${variables.roles} roles`,
              ].join("\n"),
          },
        },
      },
      USER: {
        MESSAGE_1: {
          FIELD_1: {
            FIELD: "**Información Xeral**",
            VALUE: (variables: {
              name: string;
              id: string;
              createdAt: string;
              joinedAt: string;
              booster: string;
            }): string =>
              [
                `${Emojis.RIGHT} **Usuario**: ${variables.name}`,
                `${Emojis.RIGHT} **IDE**: ${variables.id}`,
                `${Emojis.RIGHT} **Data de Creación**: ${variables.createdAt}`,
                `${Emojis.RIGHT} **Data de Membresia**: ${variables.joinedAt}`,
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
        SUGGESTIONS_NOT_FOUND: `**${Emojis.MARK} A canle de suxestións non foi atopado**`,
        REVIEW_NOT_FOUND: `**${Emojis.MARK} A canle de revisión non foi atopado**`,
        MESSAGE_1: {
          FIELD_1: {
            FIELD: (variables: { moderator: string }): string =>
              `**Comentario de ${variables.moderator}**`,
          },
          FIELD_2: {
            FIELD: (variables: { moderator: string }): string =>
              `**Suxestión aprobada por ${variables.moderator}**`,
          },
          FIELD_3: {
            FIELD: (variables: { moderator: string }): string =>
              `**Suxestión denegada por ${variables.moderator}**`,
          },
        },
        MESSAGE_2: `**${Emojis.WARNING} Esta suxestión está en revisión**\n${Emojis.RIGHT} Se aprobas a suxestión, enviarase á canle de suxestións. En caso contrario, eliminarase`,
      },
      WEATHER: {
        LOCATION_NOT_FOUND: (variables: { location: string }): string =>
          `**${Emojis.MARK} A localización \`${variables.location}\` non foi atopada**`,
      },
    },
  },
  HELP: {
    COMPONENTS: {
      BUTTONS: {
        ADD_TO_DISCORD: {
          LABEL: "Engadir a Discord",
        },
        SUPPORT_SERVER: {
          LABEL: "Servidor de Soporte",
        },
      },
      SELECT_MENU: {
        PLUGINS: {
          PLACEHOLDER: "Selecciona unha categoría",
          OPTIONS: {
            CONFIGURATION: {
              LABEL: "Configuración",
              DESCRIPTION: "Configura funcionalidades do bot ao teu gusto",
            },
            INFORMATION: {
              LABEL: "Información",
              DESCRIPTION: "Obtén información útil de usuarios ou do servidor",
            },
            MODERATION: {
              LABEL: "Moderación",
              DESCRIPTION:
                "Utiliza ferramentas para manter a túa comunidade segura",
            },
            UTILITY: {
              LABEL: "Útilidad",
              DESCRIPTION: "Utiliza comandos variados que sexan útiles",
            },
          },
        },
      },
    },
    MESSAGE_1: {
      MESSAGE: (variables: { mention: string }): string =>
        `**Ola! Son ${variables.mention}, un bot que ofrece unha experiencia minimalista e eficiente para as túas comunidades de Discord**\n\nEstou deseñado coa simplicidade en mente, brindando funcionalidades esenciais de maneira fácil e moderna`,
    },
  },
  GENERAL: {
    INVALID_GUILD_PROPERTY: (variables: { structure: object }): string =>
      `**${Emojis.MARK} A propiedade \`guild\` non está presente na estrutura \`${variables.structure.constructor.name}\`**\n${Emojis.RIGHT} Tenta volver executar a acción dentro dun servidor`,
    INVALID_GUILD_MEMBER: `**${Emojis.MARK} O usuario debe de ser membro do servidor**`,
    USER_IS_LIMITED: (variables: { resets: string }): string =>
      `**${Emojis.MARK} Estas executando demasiadas accións en pouco tempo**\n${Emojis.RIGHT} Recibiches un bloqueo que se reiniciará en \`${variables.resets}\``,
    PERMISSIONS: {
      GUILD: {
        USER: (variables: { permissions: string }): string =>
          `**${Emojis.MARK} Non se puido realizar esta acción debido a que necesitas o permiso de ${variables.permissions} no servidor**`,
        CLIENT: (variables: { permissions: string }): string =>
          `**${Emojis.MARK} Non se puido realizar esta acción debido a que necesito o permiso de ${variables.permissions} no servidor**`,
      },
      CHANNEL: {
        USER: (variables: { permissions: string; channel: string }): string =>
          `**${Emojis.MARK} Non se puido realizar esta acción debido a que necesitas o permiso de ${variables.permissions} na canle ${variables.channel}**`,
        CLIENT: (variables: { permissions: string; channel: string }): string =>
          `**${Emojis.MARK} Non se puido realizar esta acción debido a que necesito o permiso de ${variables.permissions} na canle ${variables.channel}**`,
      },
    },
    SOMETHING_WENT_WRONG: {
      MESSAGE: (variables: { support: string }): string =>
        `**Algo saíu mal mentres se executaba esta operación**\nSe o erro persiste, reporta o erro coa IDE proporcionada no noso [servidor de soporte](${variables.support})`,
      FIELD_1: {
        FIELD: "**Información Xeral**",
        VALUE: (variables: { id: string; name: string }): string =>
          [
            `${Emojis.RIGHT} **IDE do reporte**: ${variables.id}`,
            `${Emojis.RIGHT} **Nome do Erro**: ${variables.name}`,
          ].join("\n"),
      },
    },
    ONLY_GUILD_OWNER: `**${Emojis.MARK} Esta acción soamente pódea executar o propietario do servidor**`,
    INVALID_USER_COLLECTOR: `**${Emojis.MARK} Non podes executar os compoñentes doutro usuario**`,
  },
};
