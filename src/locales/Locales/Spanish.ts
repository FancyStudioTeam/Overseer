import colors from "@colors/colors";
import { type Nullish, codeBlock, inlineCodeBlock, isNullOrUndefined } from "@sapphire/utilities";
import { Emojis } from "#constants";
import { padding } from "#util";

export default {
    COMMANDS: {
        CONFIGURATION: {
            LANGUAGE: {
                MESSAGE_1: `**${Emojis.SUCCESS} El idioma ha sido establecido a ${inlineCodeBlock("Español")}**`,
            },
            PREMIUM: {
                CLAIM: {
                    MEMBERSHIP_NOT_FOUND: ({ code }: { code: string }) =>
                        `**${Emojis.MARK} El código ${inlineCodeBlock(code)} no ha sido encontrado**`,
                    MESSAGE_1: ({ expireDate }: { expireDate: string | Nullish }) =>
                        [
                            `**${Emojis.SUCCESS} La membresía premium ha sido reclamada**`,
                            `${Emojis.RIGHT} La membresía premium ${
                                isNullOrUndefined(expireDate)
                                    ? "`nunca caducará`"
                                    : `caducará el ${inlineCodeBlock(expireDate)}`
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
            SUGGESTIONS: {
                COMPONENTS: {
                    BUTTONS: {
                        GENERAL: {
                            COMPONENTS: {
                                BUTTONS: {
                                    CHANNEL: {
                                        LABEL: "Canal de Sugerencias",
                                    },
                                },
                                SELECT_MENU: {
                                    PLACEHOLDER: "Habilita/Deshabilita una opción adicional",
                                    OPTIONS: {
                                        USE_MESSAGES: {
                                            LABEL: "Sugerencias mediante mensajes (Usar mensajes)",
                                            DESCRIPTION:
                                                "Los usuarios pueden crear sugerencias envíando un mensaje en el canal de sugerencias",
                                        },
                                        USE_SELF_VOTE: {
                                            LABEL: "Permitir Autovoto (Usar autovoto)",
                                            DESCRIPTION: "El autor de una sugerencia puede votar su propia sugerencia",
                                        },
                                        USE_THREADS: {
                                            LABEL: "Crear hilos (Usar hilos)",
                                            DESCRIPTION: "Se crearán hilos en nuevas sugerencias",
                                        },
                                        USE_FORUMS: {
                                            LABEL: "Sugerencias en foros (Usar foros)",
                                            DESCRIPTION: "Se crearán las sugerencias mediante publicaciones de un foro",
                                        },
                                    },
                                },
                            },
                            LABEL: "General",
                            MESSAGE_1: {
                                TITLE_1: "**Panel de Configuración**",
                                FIELD_1: {
                                    FIELD: "**Configuración General**",
                                    VALUE: ({ channel }: { channel: string }) =>
                                        codeBlock(
                                            "ansi",
                                            padding(
                                                [
                                                    `${colors.reset.cyan(
                                                        "Canal de Sugerencias",
                                                    )} - ${colors.bold.magenta(channel)}`,
                                                ].join("\n"),
                                                "-",
                                            ),
                                        ),
                                },
                                FIELD_2: {
                                    FIELD: "**Opciones Adicionales**",
                                    VALUE: ({
                                        useMessages,
                                        useSelfVote,
                                        useThreads,
                                        useForums,
                                    }: {
                                        useMessages: string;
                                        useSelfVote: string;
                                        useThreads: string;
                                        useForums: string;
                                    }) =>
                                        codeBlock(
                                            "ansi",
                                            padding(
                                                [
                                                    `${colors.reset.cyan("Usar mensajes")} - ${colors.bold.magenta(
                                                        useMessages,
                                                    )}`,
                                                    `${colors.reset.cyan("Usar autovoto")} - ${colors.bold.magenta(
                                                        useSelfVote,
                                                    )}`,
                                                    `${colors.reset.cyan("Usar hilos")} - ${colors.bold.magenta(
                                                        useThreads,
                                                    )}`,
                                                    `${colors.reset.cyan("Usar foros")} - ${colors.bold.magenta(
                                                        useForums,
                                                    )}`,
                                                ].join("\n"),
                                                "-",
                                            ),
                                        ),
                                },
                            },
                        },
                        REVIEW: {
                            LABEL: "Revisión",
                        },
                        ENABLE: {
                            LABEL: "Habilitar",
                        },
                        DISABLE: {
                            LABEL: "Deshabilitar",
                        },
                    },
                },
                SYSTEM_NOT_ENABLED: `**${Emojis.MARK} El sistema de sugerencias no está habilitado**`,
                MESSAGE_1: [
                    `**${Emojis.WAVE} Bienvenido al panel del sistema de sugerencias**`,
                    `${Emojis.RIGHT} Puedes empezar a configurar el sistema de sugerencias aquí`,
                ].join("\n"),
            },
            TIMEZONE: {
                TIMEZONE_NOT_FOUND: ({ timezone }: { timezone: string }) =>
                    `**${Emojis.MARK} La zona horaria ${inlineCodeBlock(timezone)} no ha sido encontrada**`,
                MESSAGE_1: ({ timezone }: { timezone: string }) =>
                    `**${Emojis.SUCCESS} La zona horaria ha sido establecida a ${inlineCodeBlock(timezone)}**`,
            },
        },
        INFORMATION: {
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
                    },
                },
            },
            USER: {
                MESSAGE_1: {
                    TITLE_1: ({ name }: { name: string }) => `**Información de ${name}**`,
                    FIELD_1: {
                        FIELD: "**Información General**",
                        VALUE: ({ name, id }: { name: string; id: string }) =>
                            [`${Emojis.RIGHT} **Usuario**: ${name}`, `${Emojis.RIGHT} **ID**: ${id}`].join("\n"),
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
                MESSAGE_1: ({
                    user,
                    moderator,
                    reason,
                }: {
                    user: string;
                    moderator: string;
                    reason: string;
                }) =>
                    [
                        `**${Emojis.SUCCESS} El usuario ${user} ha sido baneado por ${moderator}**`,
                        `${Emojis.RIGHT} **Razón**: ${reason}`,
                    ].join("\n"),
            },
            KICK: {
                MESSAGE_1: ({
                    username,
                    moderator,
                    reason,
                }: {
                    username: string;
                    moderator: string;
                    reason: string;
                }) =>
                    [
                        `**${Emojis.SUCCESS} El usuario ${username} ha sido expulsado por ${moderator}**`,
                        `${Emojis.RIGHT} **Razón**: ${reason}`,
                    ].join("\n"),
            },
            SOFTBAN: {
                MESSAGE_1: ({
                    user,
                    moderator,
                    reason,
                }: {
                    user: string;
                    moderator: string;
                    reason: string;
                }) =>
                    [
                        `**${Emojis.SUCCESS} El usuario ${user} ha sido softbaneado por ${moderator}**`,
                        `${Emojis.RIGHT} **Razón**: ${reason}`,
                    ].join("\n"),
            },
            TIMEOUT: {
                ADD: {
                    INVALID_DURATION_FORMAT: `**${Emojis.MARK} La duración devolvió un formato inválido**`,
                    ALLOWED_DURATION_VALUES: `**${Emojis.MARK} La duración debe ser mayor o igual a 5 segundos y menor o igual a 28 días**`,
                    MESSAGE_1: ({
                        user,
                        moderator,
                        reason,
                    }: {
                        user: string;
                        moderator: string;
                        reason: string;
                    }) =>
                        [
                            `**${Emojis.SUCCESS} El moderador ${moderator} ha añadido un tiempo de espera al usuario ${user}**`,
                            `${Emojis.RIGHT} **Razón**: ${reason}`,
                        ].join("\n"),
                },
                REMOVE: {
                    USER_NOT_TIMEOUTED: `**${Emojis.MARK} El usuario no tiene un tiempo de espera**`,
                    MESSAGE_1: ({
                        user,
                        moderator,
                        reason,
                    }: {
                        user: string;
                        moderator: string;
                        reason: string;
                    }) =>
                        [
                            `**${Emojis.SUCCESS} El moderador ${moderator} ha eliminado el tiempo de espera del usuario ${user}**`,
                            `${Emojis.RIGHT} **Razón**: ${reason}`,
                        ].join("\n"),
                },
            },
            UNBAN: {
                BAN_NOT_FOUND: ({ ban }: { ban: string }) =>
                    `**${Emojis.MARK} El baneo ${inlineCodeBlock(ban)} no ha sido encontrado**`,
                MESSAGE_1: ({
                    user,
                    moderator,
                    reason,
                }: {
                    user: string;
                    moderator: string;
                    reason: string;
                }) =>
                    [
                        `**${Emojis.SUCCESS} El usuario ${user} ha sido desbaneado por ${moderator}**`,
                        `${Emojis.RIGHT} **Razón**: ${reason}`,
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
                SYSTEM_NOT_ENABLED: `**${Emojis.MARK} El sistema de sugerencias no está habilitado**`,
                SUGGESTIONS_NOT_FOUND: `**${Emojis.MARK} El canal de sugerencias no ha sido encontrado**`,
                REVIEW_NOT_FOUND: `**${Emojis.MARK} El canal de revisión no ha sido encontrado**`,
                SUGGESTION_NOT_FOUND: ({ id }: { id: string }) =>
                    `**${Emojis.MARK} La sugerencia ${inlineCodeBlock(id)} no ha sido encontrada**`,
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
                MESSAGE_2: `**${Emojis.WARNING} Esta sugerencia requiere una aprobación antes de ser pública**`,
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
    GLOBAL: {
        INVALID_GUILD_PROPERTY: ({ structure }: { structure: object }) =>
            [
                `**${Emojis.MARK} La propiedad ${inlineCodeBlock(
                    "guild",
                )} no está presente en la estructura ${inlineCodeBlock(structure.constructor.name)}**`,
                `${Emojis.RIGHT} Intenta volver a ejecutar la acción dentro de un servidor`,
            ].join("\n"),
        INVALID_GUILD_MEMBER: `**${Emojis.MARK} El usuario debe ser miembro de este servidor**`,
        USER_IS_LIMITED: ({ resets }: { resets: string }) =>
            [
                `**${Emojis.MARK} Estas ejecutando demasiadas acciones en poco tiempo**`,
                `${Emojis.RIGHT} Has recibido un bloqueo que se reiniciará en ${resets}`,
            ].join("\n"),
        CANNOT_MODERATE_MEMBER: `**${Emojis.MARK} No puedes moderar a este usuario**`,
        HIERARCHY: {
            USER: `**${Emojis.MARK} No puedes moderar a un usuario con una jerarquía igual o superior que tu jerarquía**`,
            CLIENT: `**${Emojis.MARK} No puedo moderar a un usuario con una jerarquía igual o superior que la jerarquía del bot**`,
        },
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
                    `**${Emojis.MARK} El servidor devolvió un error de tipo ${inlineCodeBlock(name)}**`,
                    `${Emojis.RIGHT} **ID del Reporte**: ${id}`,
                ].join("\n"),
        },
        ONLY_GUILD_OWNER: `**${Emojis.MARK} Esta acción solamente la puede ejecutar el propietario del servidor**`,
        INVALID_USER_COLLECTOR: `**${Emojis.MARK} No puedes ejecutar este componente**`,
    },
    PERMISSIONS: {
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
    },
};
