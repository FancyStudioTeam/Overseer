import colors from "@colors/colors";
import { codeBlock, inlineCodeBlock } from "@sapphire/utilities";
import type { PermissionName } from "oceanic.js";
import { Emojis } from "#constants";
import { padding } from "#util/Util.js";

export default {
  COMMANDS: {
    INFORMATION: {
      BOT: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**Información de ${name}**`,
          FIELD_1: {
            FIELD: "**Información General**",
            VALUE: ({ version, memory }: { version: string; memory: string }) =>
              [
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Versión**: ${version}`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Uso de RAM**: ${memory}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Estadísticas**",
            VALUE: ({ users, guilds, shards }: { users: number; guilds: number; shards: number }) =>
              [
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Usuarios**: ${users} usuarios`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Servidores**: ${guilds} servidores`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Shards**: ${shards} shards`,
              ].join("\n"),
          },
          FIELD_3: {
            FIELD: "**Fecha del Último Reinicio**",
          },
        },
      },
      HELP: {
        MESSAGE_1: {
          TITLE_1: ({ name }: { name: string }) => `**Panel de Ayuda de ${name}**`,
          FIELD_1: {
            FIELD: ({ command }: { command: string }) => `**Subcomandos de ${inlineCodeBlock(`/${command}`)}**`,
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
                  `${colors.reset.cyan("Referencia REST")} - ${colors.bold.magenta(rest)}`,
                  `${colors.reset.cyan("Conexión WebSocket")} - ${colors.bold.magenta(shard)}`,
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
            VALUE: ({ name, id, owner }: { name: string; id: string; owner: string }) =>
              [
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Nombre**: ${name}`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **ID**: ${id}`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Propietario**: ${owner}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Estadísticas**",
            VALUE: ({ members, channels, roles }: { members: number; channels: number; roles: number }) =>
              [
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Miembros**: ${members} miembros`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Canales**: ${channels} canales`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Roles**: ${roles} roles`,
              ].join("\n"),
          },
          FIELD_3: {
            FIELD: "**Fecha de Creación**",
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
                `${Emojis.EXPAND_CIRCLE_RIGHT} **Usuario**: ${name}`,
                `${Emojis.EXPAND_CIRCLE_RIGHT} **ID**: ${id}`,
              ].join("\n"),
          },
          FIELD_2: {
            FIELD: "**Fecha de Creación**",
          },
          FIELD_3: {
            FIELD: "**Fecha de Membresía**",
          },
        },
      },
    },
    MODERATION: {
      BAN: {
        MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
          [
            `**${Emojis.CHECK_CIRCLE_COLOR} El usuario ${user} ha sido baneado por ${moderator}**`,
            `${Emojis.EXPAND_CIRCLE_RIGHT} **Razón**: ${reason}`,
          ].join("\n"),
      },
      KICK: {
        MESSAGE_1: ({ username, moderator, reason }: { username: string; moderator: string; reason: string }) =>
          [
            `**${Emojis.CHECK_CIRCLE_COLOR} El usuario ${username} ha sido expulsado por ${moderator}**`,
            `${Emojis.EXPAND_CIRCLE_RIGHT} **Razón**: ${reason}`,
          ].join("\n"),
      },
      SOFTBAN: {
        MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
          [
            `**${Emojis.CHECK_CIRCLE_COLOR} El usuario ${user} ha sido softbaneado por ${moderator}**`,
            `${Emojis.EXPAND_CIRCLE_RIGHT} **Razón**: ${reason}`,
          ].join("\n"),
      },
      PURGE: {
        INVALID_AMOUNT: `**${Emojis.CANCEL_CIRCLE_COLOR} La cantidad de mensajes debe de ser mayor a 1 y menor que 100**`,
        NO_MESSAGES: `**${Emojis.CANCEL_CIRCLE_COLOR} No hay mensajes para eliminar**`,
        SUCCESS_MESSAGE: ({ count }: { count: number }) =>
          `**${Emojis.CHECK_CIRCLE_COLOR} Se eliminaron ${count} mensajes exitosamente**`,
      },
      TIMEOUT: {
        ADD: {
          INVALID_DURATION_FORMAT: `**${Emojis.CANCEL_CIRCLE_COLOR} La duración devolvió un formato inválido**`,
          ALLOWED_DURATION_VALUES: `**${Emojis.CANCEL_CIRCLE_COLOR} La duración debe ser mayor o igual a 5 segundos y menor o igual a 28 días**`,
          MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
            [
              `**${Emojis.CHECK_CIRCLE_COLOR} El moderador ${moderator} ha añadido un tiempo de espera al usuario ${user}**`,
              `${Emojis.EXPAND_CIRCLE_RIGHT} **Razón**: ${reason}`,
            ].join("\n"),
        },
        REMOVE: {
          USER_NOT_TIMEOUTED: `**${Emojis.CANCEL_CIRCLE_COLOR} El usuario no tiene un tiempo de espera**`,
          MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
            [
              `**${Emojis.CHECK_CIRCLE_COLOR} El moderador ${moderator} ha eliminado el tiempo de espera del usuario ${user}**`,
              `${Emojis.EXPAND_CIRCLE_RIGHT} **Razón**: ${reason}`,
            ].join("\n"),
        },
      },
      UNBAN: {
        BAN_NOT_FOUND: ({ ban }: { ban: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} El baneo ${inlineCodeBlock(ban)} no ha sido encontrado**`,
        MESSAGE_1: ({ user, moderator, reason }: { user: string; moderator: string; reason: string }) =>
          [
            `**${Emojis.CHECK_CIRCLE_COLOR} El usuario ${user} ha sido desbaneado por ${moderator}**`,
            `${Emojis.EXPAND_CIRCLE_RIGHT} **Razón**: ${reason}`,
          ].join("\n"),
      },
    },
    UTILITY: {
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
        SYSTEM_NOT_ENABLED: `**${Emojis.CANCEL_CIRCLE_COLOR} El sistema de sugerencias no está habilitado**`,
        SUGGESTIONS_NOT_FOUND: `**${Emojis.CANCEL_CIRCLE_COLOR} El canal de sugerencias no ha sido encontrado**`,
        REVIEW_NOT_FOUND: `**${Emojis.CANCEL_CIRCLE_COLOR} El canal de revisión no ha sido encontrado**`,
        SUGGESTION_NOT_FOUND: ({ id }: { id: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} La sugerencia ${inlineCodeBlock(id)} no ha sido encontrada**`,
        MESSAGE_1: {
          TITLE_1: ({ username }: { username: string }) => `**Sugerencia de ${username}**`,
          FIELD_1: {
            FIELD: ({ moderator }: { moderator: string }) => `**Comentario de ${moderator}**`,
          },
          FIELD_2: {
            FIELD: ({ moderator }: { moderator: string }) => `**Sugerencia aprobada por ${moderator}**`,
          },
          FIELD_3: {
            FIELD: ({ moderator }: { moderator: string }) => `**Sugerencia denegada por ${moderator}**`,
          },
        },
        MESSAGE_2: `**${Emojis.ERROR} Esta sugerencia requiere una aprobación antes de ser pública**`,
      },
    },
  },
  GLOBAL: {
    INVALID_GUILD_PROPERTY: ({ structure }: { structure: object }) =>
      [
        `**${Emojis.CANCEL_CIRCLE_COLOR} La propiedad ${inlineCodeBlock(
          "guild",
        )} no está presente en la estructura ${inlineCodeBlock(structure.constructor.name)}**`,
        `${Emojis.EXPAND_CIRCLE_RIGHT} Intenta volver a ejecutar la acción dentro de un servidor`,
      ].join("\n"),
    INVALID_GUILD_MEMBER: `**${Emojis.CANCEL_CIRCLE_COLOR} El usuario debe ser miembro de este servidor**`,
    USER_IS_LIMITED: ({ resets }: { resets: string }) =>
      [
        `**${Emojis.CANCEL_CIRCLE_COLOR} Estas ejecutando demasiadas acciones en poco tiempo**`,
        `${Emojis.EXPAND_CIRCLE_RIGHT} Has recibido un bloqueo que se reiniciará en ${resets}`,
      ].join("\n"),
    CANNOT_MODERATE_MEMBER: `**${Emojis.CANCEL_CIRCLE_COLOR} No puedes moderar a este usuario**`,
    HIERARCHY: {
      USER: `**${Emojis.CANCEL_CIRCLE_COLOR} No puedes moderar a un usuario con una jerarquía igual o superior que tu jerarquía**`,
      CLIENT: `**${Emojis.CANCEL_CIRCLE_COLOR} No puedo moderar a un usuario con una jerarquía igual o superior que la jerarquía del bot**`,
    },
    PERMISSIONS: {
      GUILD: {
        USER: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} No se ha podido realizar esta acción debido a que necesitas el permiso de ${permissions} en el servidor**`,
        CLIENT: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} No se ha podido realizar esta acción debido a que necesito el permiso de ${permissions} en el servidor**`,
      },
      CHANNEL: {
        USER: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} No se ha podido realizar esta acción debido a que necesitas el permiso de ${permissions} en el canal ${channel}**`,
        CLIENT: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CANCEL_CIRCLE_COLOR} No se ha podido realizar esta acción debido a que necesito el permiso de ${permissions} en el canal ${channel}**`,
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
          `**${Emojis.CANCEL_CIRCLE_COLOR} El servidor devolvió un error de tipo ${inlineCodeBlock(name)}**`,
          `${Emojis.EXPAND_CIRCLE_RIGHT} **ID del Reporte**: ${id}`,
        ].join("\n"),
    },
    ONLY_GUILD_OWNER: `**${Emojis.CANCEL_CIRCLE_COLOR} Esta acción solamente la puede ejecutar el propietario del servidor**`,
    INVALID_USER_COLLECTOR: `**${Emojis.CANCEL_CIRCLE_COLOR} No puedes ejecutar este componente**`,
  },
  PERMISSIONS: permissions(),
};

function permissions(): Record<PermissionName, string> {
  return {
    CREATE_INSTANT_INVITE: "Crear Invitación Instantánea",
    KICK_MEMBERS: "Expulsar Miembros",
    BAN_MEMBERS: "Banear Miembros",
    ADMINISTRATOR: "Administrador",
    MANAGE_CHANNELS: "Gestionar Canales",
    MANAGE_GUILD: "Gestionar Servidor",
    ADD_REACTIONS: "Añadir Reacciones",
    VIEW_AUDIT_LOG: "Ver Registro de Auditoria",
    PRIORITY_SPEAKER: "Prioridad de Palabra",
    STREAM: "Compartir Pantalla",
    VIEW_CHANNEL: "Ver Canal",
    SEND_MESSAGES: "Enviar Mensajes",
    SEND_TTS_MESSAGES: "Enviar Mensajes TTS",
    MANAGE_MESSAGES: "Gestionar Mensajes",
    EMBED_LINKS: "Enlaces Incrustados",
    ATTACH_FILES: "Adjuntar Archivos",
    READ_MESSAGE_HISTORY: "Leer Historial de Mensajes",
    MENTION_EVERYONE: "Mencionar Everyone",
    USE_EXTERNAL_EMOJIS: "Usar Emojis Externos",
    VIEW_GUILD_INSIGHTS: "Ver Información del Servidor",
    CONNECT: "Conectar",
    SPEAK: "Hablar",
    MUTE_MEMBERS: "Silenciar Miembros",
    DEAFEN_MEMBERS: "Ensordecer Miembros",
    MOVE_MEMBERS: "Mover Miembros",
    USE_VAD: "Usar VAD",
    CHANGE_NICKNAME: "Cambiar Apodo",
    MANAGE_NICKNAMES: "Gestionar Apodos",
    MANAGE_ROLES: "Gestionar Roles",
    MANAGE_WEBHOOKS: "Gestionar Webhooks",
    MANAGE_GUILD_EXPRESSIONS: "Gestionar Expresiones del Servidor",
    USE_APPLICATION_COMMANDS: "Usar Comandos de Aplicaciones",
    REQUEST_TO_SPEAK: "Solicitar Hablar",
    MANAGE_EVENTS: "Gestionar Eventos",
    MANAGE_THREADS: "Gestionar Hilos",
    CREATE_PUBLIC_THREADS: "Crear Hilos Públicos",
    CREATE_PRIVATE_THREADS: "Crear Hilos Privados",
    USE_EXTERNAL_STICKERS: "Usar Stickers Externos",
    SEND_MESSAGES_IN_THREADS: "Enviar Mensajes en Hilos",
    USE_EMBEDDED_ACTIVITIES: "Usar Actividades Incrustadas",
    MODERATE_MEMBERS: "Moderar Miembros",
    VIEW_CREATOR_MONETIZATION_ANALYTICS: "Ver Analíticas de Monetización del Creador",
    USE_SOUNDBOARD: "Usar Panel de Sonidos",
    CREATE_GUILD_EXPRESSIONS: "Crear Expresiones del Servidor",
    CREATE_EVENTS: "Crear Eventos",
    USE_EXTERNAL_SOUNDS: "Usar Sonidos Externos",
    SEND_VOICE_MESSAGES: "Enviar Mensajes de Voz",
    USE_CLYDE_AI: "Usar IA de Clyde",
    SET_VOICE_CHANNEL_STATUS: "Establecer Estado del Canal de Voz",
    SEND_POLLS: "Enviar Encuestas",
    USE_EXTERNAL_APPS: "Usar Aplicaciones Externas",
  };
}
