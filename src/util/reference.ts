import type { PermissionName } from "oceanic.js";

type Value = Record<string, string>;
type Permissions = Record<PermissionName, Value>;

export const permissions: Permissions = {
  CREATE_INSTANT_INVITE: {
    en: "Create Instant Invite",
    es: "Crear Invitación Instantánea",
  },
  KICK_MEMBERS: {
    en: "Kick Members",
    es: "Expulsar Miembros",
  },
  BAN_MEMBERS: {
    en: "Ban Members",
    es: "Banear Miembros",
  },
  ADMINISTRATOR: {
    en: "Administrator",
    es: "Administrador",
  },
  MANAGE_CHANNELS: {
    en: "Manage Channels",
    es: "Gestionar Canales",
  },
  MANAGE_GUILD: {
    en: "Manage Server",
    es: "Gestionar Servidor",
  },
  ADD_REACTIONS: {
    en: "Add Reactions",
    es: "Añadir Reacciones",
  },
  VIEW_AUDIT_LOG: {
    en: "View Audit Log",
    es: "Ver Registro de Auditoría",
  },
  PRIORITY_SPEAKER: {
    en: "Priority Speaker",
    es: "Orador Prioritario",
  },
  STREAM: {
    en: "Stream",
    es: "Transmitir",
  },
  VIEW_CHANNEL: {
    en: "View Channel",
    es: "Ver Canal",
  },
  SEND_MESSAGES: {
    en: "Send Messages",
    es: "Enviar Mensajes",
  },
  SEND_TTS_MESSAGES: {
    en: "Send TTS Messages",
    es: "Enviar Mensajes TTS",
  },
  MANAGE_MESSAGES: {
    en: "Manage Messages",
    es: "Gestionar Mensajes",
  },
  EMBED_LINKS: {
    en: "Embed Links",
    es: "Incrustar Enlaces",
  },
  ATTACH_FILES: {
    en: "Attach Files",
    es: "Adjuntar Archivos",
  },
  READ_MESSAGE_HISTORY: {
    en: "Read Message History",
    es: "Leer Historial de Mensajes",
  },
  MENTION_EVERYONE: {
    en: "Mention Everyone",
    es: "Mencionar Everyone",
  },
  USE_EXTERNAL_EMOJIS: {
    en: "Use External Emojis",
    es: "Usar Emojis Externos",
  },
  VIEW_GUILD_INSIGHTS: {
    en: "View Server Insights",
    es: "Ver Información del Servidor",
  },
  CONNECT: {
    en: "Connect",
    es: "Conectar",
  },
  SPEAK: {
    en: "Speak",
    es: "Hablar",
  },
  MUTE_MEMBERS: {
    en: "Mute Members",
    es: "Silenciar Miembros",
  },
  DEAFEN_MEMBERS: {
    en: "Deafen Members",
    es: "Ensordecer Miembros",
  },
  MOVE_MEMBERS: {
    en: "Move Members",
    es: "Mover Miembros",
  },
  USE_VAD: {
    en: "Use VAD",
    es: "Usar VAD",
  },
  CHANGE_NICKNAME: {
    en: "Change Nickname",
    es: "Cambiar Apodo",
  },
  MANAGE_NICKNAMES: {
    en: "Manage Nicknames",
    es: "Gestionar Apodos",
  },
  MANAGE_ROLES: {
    en: "Manage Roles",
    es: "Gestionar Roles",
  },
  MANAGE_WEBHOOKS: {
    en: "Manage Webhooks",
    es: "Gestionar Webhooks",
  },
  MANAGE_GUILD_EXPRESSIONS: {
    en: "Manage Server Expressions",
    es: "Gestionar Expresiones del Servidor",
  },
  USE_APPLICATION_COMMANDS: {
    en: "Use Application Commands",
    es: "Usar Comandos de Aplicación",
  },
  REQUEST_TO_SPEAK: {
    en: "Request To Speak",
    es: "Solicitar Hablar",
  },
  MANAGE_EVENTS: {
    en: "Manage Events",
    es: "Gestionar Eventos",
  },
  MANAGE_THREADS: {
    en: "Manage Threads",
    es: "Gestionar Hilos",
  },
  CREATE_PUBLIC_THREADS: {
    en: "Create Public Threads",
    es: "Crear Hilos Públicos",
  },
  CREATE_PRIVATE_THREADS: {
    en: "Create Private Threads",
    es: "Crear Hilos Privados",
  },
  USE_EXTERNAL_STICKERS: {
    en: "Use External Stickers",
    es: "Usar Pegatinas Externas",
  },
  SEND_MESSAGES_IN_THREADS: {
    en: "Send Messages In Threads",
    es: "Enviar Mensajes en Hilos",
  },
  USE_EMBEDDED_ACTIVITIES: {
    en: "Use Embedded Activities",
    es: "Usar Actividades Incrustadas",
  },
  MODERATE_MEMBERS: {
    en: "Moderate Members",
    es: "Moderar Miembros",
  },
  VIEW_CREATOR_MONETIZATION_ANALYTICS: {
    en: "View Creator Monetization Analytics",
    es: "Ver Analíticas de Monetización del Creador",
  },
  USE_SOUNDBOARD: {
    en: "Use Soundboard",
    es: "Usar Soundboard",
  },
  CREATE_GUILD_EXPRESSIONS: {
    en: "Create Server Expressions",
    es: "Crear Expresiones del Servidor",
  },
  CREATE_EVENTS: {
    en: "Create Events",
    es: "Crear Eventos",
  },
  USE_EXTERNAL_SOUNDS: {
    en: "Use External Sounds",
    es: "Usar Sonidos Externos",
  },
  SEND_VOICE_MESSAGES: {
    en: "Send Voice Messages",
    es: "Enviar Mensajes de Voz",
  },
  USE_CLYDE_AI: {
    en: "Use Clyde AI",
    es: "Usar Clyde AI",
  },
  SET_VOICE_CHANNEL_STATUS: {
    en: "Set Voice Channel Status",
    es: "Establecer Estado del Canal de Voz",
  },
};
