import colors from "@colors/colors";
import { bold, codeBlock } from "@discordjs/formatters";
import type { PermissionName } from "oceanic.js";
import { Emojis } from "#constants";

const permissions: Record<PermissionName, string> = {
  ADD_REACTIONS: "Añadir Reacciones",
  ADMINISTRATOR: "Administrador",
  ATTACH_FILES: "Adjuntar Archivos",
  BAN_MEMBERS: "Banear Miembros",
  CHANGE_NICKNAME: "Cambiar Apodo",
  CONNECT: "Conectar",
  CREATE_EVENTS: "Crear Eventos",
  CREATE_GUILD_EXPRESSIONS: "Crear Expresiones del Servidor",
  CREATE_INSTANT_INVITE: "Crear Invitación Instantánea",
  CREATE_PRIVATE_THREADS: "Crear Hilos Privados",
  CREATE_PUBLIC_THREADS: "Crear Hilos Públicos",
  DEAFEN_MEMBERS: "Ensordecer Miembros",
  EMBED_LINKS: "Enlaces Incrustados",
  KICK_MEMBERS: "Expulsar Miembros",
  MANAGE_CHANNELS: "Gestionar Canales",
  MANAGE_EVENTS: "Gestionar Eventos",
  MANAGE_GUILD: "Gestionar Servidor",
  MANAGE_GUILD_EXPRESSIONS: "Gestionar Expresiones del Servidor",
  MANAGE_MESSAGES: "Gestionar Mensajes",
  MANAGE_NICKNAMES: "Gestionar Apodos",
  MANAGE_ROLES: "Gestionar Roles",
  MANAGE_THREADS: "Gestionar Hilos",
  MANAGE_WEBHOOKS: "Gestionar Webhooks",
  MENTION_EVERYONE: "Mencionar Everyone",
  MODERATE_MEMBERS: "Moderar Miembros",
  MOVE_MEMBERS: "Mover Miembros",
  MUTE_MEMBERS: "Silenciar Miembros",
  PRIORITY_SPEAKER: "Prioridad de Palabra",
  READ_MESSAGE_HISTORY: "Leer Historial de Mensajes",
  REQUEST_TO_SPEAK: "Solicitar Hablar",
  SEND_MESSAGES: "Enviar Mensajes",
  SEND_MESSAGES_IN_THREADS: "Enviar Mensajes en Hilos",
  SEND_POLLS: "Enviar Encuestas",
  SEND_TTS_MESSAGES: "Enviar Mensajes TTS",
  SEND_VOICE_MESSAGES: "Enviar Mensajes de Voz",
  SET_VOICE_CHANNEL_STATUS: "Establecer Estado del Canal de Voz",
  SPEAK: "Hablar",
  STREAM: "Compartir Pantalla",
  USE_APPLICATION_COMMANDS: "Usar Comandos de Aplicaciones",
  USE_CLYDE_AI: "Usar IA de Clyde",
  USE_EMBEDDED_ACTIVITIES: "Usar Actividades Incrustadas",
  USE_EXTERNAL_APPS: "Usar Aplicaciones Externas",
  USE_EXTERNAL_EMOJIS: "Usar Emojis Externos",
  USE_EXTERNAL_SOUNDS: "Usar Sonidos Externos",
  USE_EXTERNAL_STICKERS: "Usar Stickers Externos",
  USE_SOUNDBOARD: "Usar Panel de Sonidos",
  USE_VAD: "Usar VAD",
  VIEW_AUDIT_LOG: "Ver Registro de Auditoria",
  VIEW_CHANNEL: "Ver Canal",
  VIEW_CREATOR_MONETIZATION_ANALYTICS: "Ver Analíticas de Monetización del Creador",
  VIEW_GUILD_INSIGHTS: "Ver Información del Servidor",
};

export default {
  COMMANDS: {
    INFORMATION: {
      DEBUG: {
        MESSAGE_1: {
          TITLE_1: "Información de la Depuración",
          DESCRIPTION_1: ({
            guilds,
            users,
          }: {
            guilds: number;
            users: number;
          }) =>
            codeBlock(
              "ansi",
              [`${colors.magenta("Servidores:")} ${guilds}`, `${colors.magenta("Usuarios:")} ${users}`].join("\n"),
            ),
        },
      },
    },
  },
  GLOBAL: {
    USER_IS_LIMITED: ({
      resets,
    }: {
      resets: string;
    }) =>
      bold(
        `${Emojis.CANCEL} Has superado el máximo número de llamadas de los comandos\n${Emojis.ARROW_CIRCLE_RIGHT} El limite se restablecerá dentro de ${resets}`,
      ),
    PERMISSIONS: {
      GUILD: {
        USER: ({
          permissions,
        }: {
          permissions: string;
        }) =>
          bold(
            `${Emojis.CANCEL} No se ha podido realizar esta acción debido a que necesitas el permiso de ${permissions} en el servidor`,
          ),
        CLIENT: ({
          permissions,
        }: {
          permissions: string;
        }) =>
          bold(
            `${Emojis.CANCEL} No se ha podido realizar esta acción debido a que necesito el permiso de ${permissions} en el servidor`,
          ),
      },
      CHANNEL: {
        USER: ({
          permissions,
          channel,
        }: {
          permissions: string;
          channel: string;
        }) =>
          bold(
            `${Emojis.CANCEL} No se ha podido realizar esta acción debido a que necesitas el permiso de ${permissions} en el canal ${channel}`,
          ),
        CLIENT: ({
          permissions,
          channel,
        }: {
          permissions: string;
          channel: string;
        }) =>
          bold(
            `${Emojis.CANCEL} No se ha podido realizar esta acción debido a que necesito el permiso de ${permissions} en el canal ${channel}`,
          ),
      },
    },
    INVALID_USER_COLLECTOR: bold(`${Emojis.CANCEL} No puedes ejecutar este componente`),
  },
  PERMISSIONS: permissions,
};
