import { inlineCodeBlock } from "@sapphire/utilities";
import type { PermissionName, UserFlags } from "oceanic.js";
import { Emojis } from "#constants";

export default {
  GLOBAL: {
    INVALID_GUILD_PROPERTY: ({ structure }: { structure: object }) =>
      [
        `**${Emojis.CIRCLE_X_COLOR} La propiedad ${inlineCodeBlock(
          "guild",
        )} no está presente en la estructura ${inlineCodeBlock(structure.constructor.name)}**`,
        `${Emojis.CIRCLE_CHEVRON_RIGHT} Intenta volver a ejecutar la acción dentro de un servidor`,
      ].join("\n"),
    INVALID_GUILD_MEMBER: `**${Emojis.CIRCLE_X_COLOR} El usuario debe ser miembro de este servidor**`,
    USER_IS_LIMITED: ({ resets }: { resets: string }) =>
      [
        `**${Emojis.CIRCLE_X_COLOR} Estas ejecutando demasiadas acciones en poco tiempo**`,
        `${Emojis.CIRCLE_CHEVRON_RIGHT} Has recibido un bloqueo que se reiniciará en ${resets}`,
      ].join("\n"),
    CANNOT_MODERATE_MEMBER: `**${Emojis.CIRCLE_X_COLOR} No puedes moderar a este usuario**`,
    HIERARCHY: {
      USER: `**${Emojis.CIRCLE_X_COLOR} No puedes moderar a un usuario con una jerarquía igual o superior que tu jerarquía**`,
      CLIENT: `**${Emojis.CIRCLE_X_COLOR} No puedo moderar a un usuario con una jerarquía igual o superior que la jerarquía del bot**`,
    },
    PERMISSIONS: {
      GUILD: {
        USER: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CIRCLE_X_COLOR} No se ha podido realizar esta acción debido a que necesitas el permiso de ${permissions} en el servidor**`,
        CLIENT: ({ permissions }: { permissions: string }) =>
          `**${Emojis.CIRCLE_X_COLOR} No se ha podido realizar esta acción debido a que necesito el permiso de ${permissions} en el servidor**`,
      },
      CHANNEL: {
        USER: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CIRCLE_X_COLOR} No se ha podido realizar esta acción debido a que necesitas el permiso de ${permissions} en el canal ${channel}**`,
        CLIENT: ({ permissions, channel }: { permissions: string; channel: string }) =>
          `**${Emojis.CIRCLE_X_COLOR} No se ha podido realizar esta acción debido a que necesito el permiso de ${permissions} en el canal ${channel}**`,
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
          `**${Emojis.CIRCLE_X_COLOR} El servidor devolvió un error de tipo ${inlineCodeBlock(name)}**`,
          `${Emojis.CIRCLE_CHEVRON_RIGHT} **ID del Reporte**: ${id}`,
        ].join("\n"),
    },
    ONLY_GUILD_OWNER: `**${Emojis.CIRCLE_X_COLOR} Esta acción solamente la puede ejecutar el propietario del servidor**`,
    INVALID_USER_COLLECTOR: `**${Emojis.CIRCLE_X_COLOR} No puedes ejecutar este componente**`,
  },
  PERMISSIONS: permissions(),
  USER_FLAGS: userFlags(),
};

function permissions(): Record<PermissionName, string> {
  return {
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
}

function userFlags(): Record<UserFlags, string> {
  return {
    1: "Personal de Discord",
    2: "Propietario de Servidor Asociado",
    4: "Eventos de Hype Squad",
    8: "Cazador de Errores de Discord Nivel 1",
    16: "MFA SMS",
    32: "Promoción Premium Descartada",
    64: "Hype Squad Bravery",
    128: "Hype Squad Brilliance",
    256: "Hype Squad Balance",
    512: "Partidario Temprano",
    1024: "Usuario de Pseudo Equipo",
    2048: "Aplicación Interna",
    4096: "Sistema",
    8192: "Tiene Mensajes Urgentes No Leídos",
    16384: "Cazador de Errores de Discord Nivel 2",
    32768: "Eliminado por Menor de Edad",
    65536: "Aplicación Verificada",
    131072: "Desarrollador de Bots con Verificación Temprana",
    262144: "Alumni de los Programas de Moderación",
    524288: "Interacciones HTTP",
    1048576: "Spammer",
    2097152: "Desactivar Premium",
    4194304: "Desarrollador Activo",
    8589934592: "Límite de Tasa Global Alto",
    17179869184: "Eliminado",
    34359738368: "Desactivar Actividad Sospechosa",
    68719476736: "Autoeliminado",
    137438953472: "Discriminador Premium",
    274877906944: "Cliente de Escritorio Utilizado",
    549755813888: "Cliente Web Utilizado",
    1099511627776: "Cliente Móvil Utilizado",
    2199023255552: "Deshabilitado",
    8796093022208: "Correo Electrónico Verificado",
    17592186044416: "Cuarentena",
    1125899906842624: "Colaborador",
    2251799813685248: "Colaborador Restringido",
  };
}
