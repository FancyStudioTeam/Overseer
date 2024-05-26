import colors from "@colors/colors";
import { type Nullish, codeBlock } from "@sapphire/utilities";
import { isNullOrUndefined } from "@sapphire/utilities";
import { Emojis } from "#constants";
import { padding } from "#util";

export default {
  COMMANDS: {
    CONFIG: {
      LANGUAGE: {
        MESSAGE_1: `**${Emojis.SUCCESS} El idioma ha sido establecido a \`Español\`**`,
      },
      PREMIUM: {
        CLAIM: {
          MEMBERSHIP_NOT_FOUND: ({ code }: { code: string }) =>
            `**${Emojis.MARK} El código \`${code}\` no ha sido encontrado**`,
          MESSAGE_1: ({ expireDate }: { expireDate: string | Nullish }) =>
            [
              `**${Emojis.SUCCESS} La membresía premium ha sido reclamada**`,
              `${Emojis.RIGHT} La membresía premium ${
                isNullOrUndefined(expireDate)
                  ? "`nunca caducará`"
                  : `caducará el \`${expireDate}\``
              }`,
            ].join("\n"),
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
                MESSAGE_1: `**${Emojis.SUCCESS} La revocación ha sido cancelada**`,
              },
            },
          },
          INVALID_GUILD_MEMBERSHIP: `**${Emojis.MARK} El servidor no tiene una membresía premium**`,
          MESSAGE_1: [
            `**${Emojis.WARNING} Estás a punto de cancelar la membresía premium**`,
            `${Emojis.RIGHT} Si lo haces, ya no podrás disfrutar de los beneficios de la membresía`,
          ].join("\n"),
        },
      },
      TIMEZONE: {
        ERRORS: {
          TIMEZONE_NOT_FOUND: ({ timezone }: { timezone: string }) =>
            `**${Emojis.MARK} La zona horaria \`${timezone}\` no ha sido encontrada**`,
        },
        MESSAGE_1: ({ timezone }: { timezone: string }) =>
          `**${Emojis.SUCCESS} La zona horaria ha sido establecida a \`${timezone}\`**`,
      },
    },
    INFO: {
      BOT: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**Información de ${name}**`,
          FIELD_1: {
            FIELD: "**Información General**",
            VALUE: ({ version, memory }: { version: string; memory: string }) =>
              [
                `${Emojis.RIGHT} **Versión**: ${version}`,
                `${Emojis.RIGHT} **Uso de RAM**: ${memory}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Estadísticas**",
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
                `${Emojis.RIGHT} **Usuarios**: ${users} usuarios`,
                `${Emojis.RIGHT} **Servidores**: ${guilds} servidores`,
                `${Emojis.RIGHT} **Shards**: ${shards} shards`,
              ].join("\n"),
          },
          FIELD_3: {
            FIELD: "**Fecha del Último Reinicio**",
            VALUE: ({ date }: { date: string }) => `${Emojis.RIGHT} ${date}`,
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
                  `${colors.reset.cyan("Referencia REST")} - ${colors.bold.magenta(
                    rest,
                  )}`,
                  `${colors.reset.cyan(
                    "Conexión WebSocket",
                  )} - ${colors.bold.magenta(shard)}`,
                ].join("\n"),
                "-",
              ),
            ),
        },
      },
      SERVER: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**Información de ${name}**`,
          FIELD_1: {
            FIELD: "**Información General**",
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
                `${Emojis.RIGHT} **Nombre**: ${name}`,
                `${Emojis.RIGHT} **ID**: ${id}`,
                `${Emojis.RIGHT} **Propietario**: ${owner}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Estadísticas**",
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
                `${Emojis.RIGHT} **Miembros**: ${members} miembros`,
                `${Emojis.RIGHT} **Canales**: ${channels} canales`,
                `${Emojis.RIGHT} **Roles**: ${roles} roles`,
              ].join("\n"),
          },
          FIELD_3: {
            FIELD: "**Fecha de Creación**",
            VALUE: ({ date }: { date: string }) => `${Emojis.RIGHT} ${date}`,
          },
        },
      },
      USER: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**Información de ${name}**`,
          FIELD_1: {
            FIELD: "**Información General**",
            VALUE: ({ name, id }: { name: string; id: string }) =>
              [
                `${Emojis.RIGHT} **Usuario**: ${name}`,
                `${Emojis.RIGHT} **ID**: ${id}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Fecha de Creación**",
            VALUE: ({ date }: { date: string }) => `${Emojis.RIGHT} ${date}`,
          },
          FIELD_3: {
            FIELD: "**Fecha de Membresía**",
            VALUE: ({ date }: { date: string }) => `${Emojis.RIGHT} ${date}`,
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
          TITLE_1: ({ username }: { username: string }) =>
            `**Sugerencia de ${username}**`,
          FIELD_1: {
            FIELD: ({ moderator }: { moderator: string }) =>
              `**Comentario de ${moderator}**`,
          },
          FIELD_2: {
            FIELD: ({ moderator }: { moderator: string }) =>
              `**Sugerencia aprobada por ${moderator}**`,
          },
          FIELD_3: {
            FIELD: ({ moderator }: { moderator: string }) =>
              `**Sugerencia denegada por ${moderator}**`,
          },
        },
      },
    },
  },
  HELP: {
    MESSAGE_1: {
      TITLE_1: ({ name }: { name: string }) => `**Panel de Ayuda de ${name}**`,
      FIELD_1: {
        FIELD: ({ command }: { command: string }) =>
          `**Subcomandos de \`/${command}\`**`,
      },
    },
  },
  GENERAL: {
    INVALID_GUILD_PROPERTY: ({ structure }: { structure: object }) =>
      [
        `**${Emojis.MARK} La propiedad \`guild\` no está presente en la estructura \`${structure.constructor.name}\`**`,
        `${Emojis.RIGHT} Intenta volver a ejecutar la acción dentro de un servidor`,
      ].join("\n"),
    INVALID_GUILD_MEMBER: `**${Emojis.MARK} El usuario debe de ser miembro del servidor**`,
    USER_IS_LIMITED: ({ resets }: { resets: string }) =>
      [
        `**${Emojis.MARK} Estas ejecutando demasiadas acciones en poco tiempo**`,
        `${Emojis.RIGHT} Has recibido un bloqueo que se reiniciará en ${resets}`,
      ].join("\n"),
    PERMISSIONS: {
      GUILD: {
        USER: ({ permissions }: { permissions: string }) =>
          `**${Emojis.MARK} No se ha podido realizar esta acción debido a que necesitas el permiso de ${permissions} en el servidor**`,
        CLIENT: ({ permissions }: { permissions: string }) =>
          `**${Emojis.MARK} No se ha podido realizar esta acción debido a que necesito el permiso de ${permissions} en el servidor**`,
      },
      CHANNEL: {
        USER: ({
          permissions,
          channel,
        }: {
          permissions: string;
          channel: string;
        }) =>
          `**${Emojis.MARK} No se ha podido realizar esta acción debido a que necesitas el permiso de ${permissions} en el canal ${channel}**`,
        CLIENT: ({
          permissions,
          channel,
        }: {
          permissions: string;
          channel: string;
        }) =>
          `**${Emojis.MARK} No se ha podido realizar esta acción debido a que necesito el permiso de ${permissions} en el canal ${channel}**`,
      },
    },
    SOMETHING_WENT_WRONG: {
      COMPONENTS: {
        BUTTONS: {
          SUPPORT: {
            LABEL: "Servidor de Soporte",
          },
        },
      },
      MESSAGE_1: ({ name, id }: { name: string; id: string }) =>
        [
          `**${Emojis.MARK} El servidor devolvió un error de tipo \`${name}\`**`,
          `${Emojis.RIGHT} **ID del Reporte**: ${id}`,
        ].join("\n"),
    },
    ONLY_GUILD_OWNER: `**${Emojis.MARK} Esta acción solamente la puede ejecutar el propietario del servidor**`,
    INVALID_USER_COLLECTOR: `**${Emojis.MARK} No puedes ejecutar este componente**`,
  },
};
