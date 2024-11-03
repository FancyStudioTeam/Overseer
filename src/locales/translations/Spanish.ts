import colors from "@colors/colors";
import { Emojis } from "@constants";
import { bold, codeBlock, inlineCode } from "@discordjs/formatters";
import { createProgressBar, formatKeyValues, formatTimestamp } from "@util/utils";
import type { PermissionName } from "oceanic.js";

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
    CONFIGURATION: {
      AUTOMATIONS: {
        CREATE: {
          ERROR_WHILE_PARSING: ({
            errorMessage,
          }: {
            errorMessage: string;
          }) =>
            [
              bold(`${Emojis.CANCEL} Ha ocurrido un error mientras se parseaba el archivo`),
              codeBlock("ts", errorMessage),
            ].join("\n"),
          MAXIMUM_SIZE_ALLOWED: ({
            maximum,
          }: {
            maximum: number;
          }) =>
            [
              bold(`${Emojis.CANCEL} La automatización ha excedido el limite del tamaño permitido`),
              bold(
                `${Emojis.ARROW_CIRCLE_RIGHT} El limite del tamaño permitido por automatización es de ${inlineCode(`${maximum.toString()}kb`)}`,
              ),
            ].join("\n"),
          MAXIMUM_AUTOMATIONS_ALLOWED: ({
            maximum,
          }: {
            maximum: number;
          }) =>
            [
              bold(`${Emojis.CANCEL} El servidor ha excedido el limite de automatizaciones permitidas`),
              bold(
                `${Emojis.ARROW_CIRCLE_RIGHT} El limite de automatizaciones permitidas por servidor es de ${inlineCode(
                  maximum.toString(),
                )}`,
              ),
            ].join("\n"),
          MESSAGE_1: ({
            automationName,
          }: {
            automationName: string;
          }) => bold(`${Emojis.CHECK_CIRCLE} La automatización ${inlineCode(automationName)} ha sido creada`),
        },
        DELETE: {
          AUTOMATION_NOT_FOUND: ({
            automationId,
          }: {
            automationId: string;
          }) => bold(`${Emojis.CANCEL} La automatizacion ${inlineCode(automationId)} no ha sido encontrada`),
          MESSAGE_1: ({
            automationName,
          }: {
            automationName: string;
          }) => bold(`${Emojis.CHECK_CIRCLE} La automatizacion ${inlineCode(automationName)} ha sido eliminada`),
        },
        LIST: {
          COMPONENTS: {
            AUTOMATION_NOT_FOUND: ({
              automationId,
            }: {
              automationId: string;
            }) => bold(`${Emojis.CANCEL} La automatizacion ${inlineCode(automationId)} no ha sido encontrada`),
            BUTTONS: {
              DISPLAY: {
                LABEL: "Mostrar Código",
              },
              DOWNLOAD: {
                LABEL: "Descargar Código",
              },
              DELETE: {
                LABEL: "Eliminar Automatización",
                MESSAGE_1: ({
                  automationName,
                }: {
                  automationName: string;
                }) => bold(`${Emojis.CHECK_CIRCLE} La automatizacion ${inlineCode(automationName)} ha sido eliminada`),
              },
            },
          },
          NO_AVAILABLE_AUTOMATIONS: bold(`${Emojis.CANCEL} El servidor no tiene automatizaciones disponibles`),
          MESSAGE_1: {
            TITLE_1: bold("Información de la Automatización"),
            FIELD_1: {
              NAME: "Información General",
              VALUE: ({
                automationId,
                automationName,
                createdBy,
              }: {
                automationId: string;
                automationName: string;
                createdBy: string;
              }) =>
                codeBlock(
                  "ansi",
                  formatKeyValues(
                    [`Nombre » ${automationName}`, `ID » ${automationId}`, `Creado Por » ${createdBy}`].join("\n"),
                    "»",
                  ),
                ),
            },
            FIELD_2: {
              NAME: "Fecha de Creación",
              VALUE: ({
                createdAt,
              }: {
                createdAt: Date;
              }) =>
                codeBlock("ansi", colors.bold.magenta(formatTimestamp(createdAt, "dddd[, ]MMMM DD[, ]YYYY[, ]HH:mm"))),
            },
            FIELD_3: {
              NAME: "Tamaño de la Automatización",
              VALUE: ({
                currentSize,
                maximumSize,
              }: {
                currentSize: number;
                maximumSize: number;
              }) =>
                codeBlock(
                  "ansi",
                  colors.bold.magenta(
                    `${createProgressBar(currentSize, maximumSize, 13)} [${currentSize}kb/${maximumSize}kb]`,
                  ),
                ),
            },
          },
        },
      },
      LANGUAGE: {
        MESSAGE_1: bold(`${Emojis.CHECK_CIRCLE} El idioma del bot ha sido establecido a ${inlineCode("Español")}`),
      },
      MEMBERSHIP: {
        REEDEM: {
          MEMBERSHIP_NOT_FOUND: ({
            membershipId,
          }: {
            membershipId: string;
          }) => bold(`${Emojis.CANCEL} La membresía ${inlineCode(membershipId)} no ha sido encontrada`),
          MESSAGE_1: ({
            membershipId,
          }: {
            membershipId: string;
          }) => bold(`${Emojis.CHECK_CIRCLE} La membresía ${inlineCode(membershipId)} ha sido canjeada`),
        },
      },
    },
    DEVELOPER: {
      EVAL: {
        COMPONENTS: {
          BUTTONS: {
            TOOK: {
              LABEL: ({
                executionTime,
              }: {
                executionTime: number;
              }) => `Tardó ${executionTime}ms`,
            },
            DELETE: {
              LABEL: "Eliminar",
            },
          },
        },
      },
      EXEC: {
        COMPONENTS: {
          BUTTONS: {
            TOOK: {
              LABEL: ({
                executionTime,
              }: {
                executionTime: number;
              }) => `Tardó ${executionTime}ms`,
            },
            DELETE: {
              LABEL: "Eliminar",
            },
          },
        },
      },
      LOOKUP_GUILD: {
        COMPONENTS: {
          BUTTONS: {
            OWNER: {
              LABEL: "Propietario",
              UNABLE_VALID_OWNER: bold(`${Emojis.CANCEL} No se ha podido obtener el propietario del servidor`),
              MESSAGE_1: {
                TITLE: bold("Información del Propietario"),
                FIELD_1: {
                  NAME: "Información General",
                  VALUE: ({
                    userId,
                    userName,
                  }: {
                    userId: string;
                    userName: string;
                  }) => codeBlock("ansi", formatKeyValues([`Nombre » ${userName}`, `ID » ${userId}`].join("\n"), "»")),
                },
                FIELD_2: {
                  NAME: "Fecha de Creación",
                  VALUE: ({
                    createdAt,
                  }: {
                    createdAt: Date;
                  }) =>
                    codeBlock(
                      "ansi",
                      colors.bold.magenta(formatTimestamp(createdAt, "dddd[, ]MMMM DD[, ]YYYY[, ]HH:mm")),
                    ),
                },
              },
            },
            INVITE: {
              LABEL: "Generar Invitación",
              OBTAIN_VALID_CHANNEL: bold(`${Emojis.CANCEL} No se ha podido obtener un canal válido`),
            },
            LEAVE: {
              LABEL: "Abandonar Servidor",
              MESSAGE_1: ({
                guildName,
              }: {
                guildName: string;
              }) => bold(`${Emojis.CHECK_CIRCLE} El servidor ${inlineCode(guildName)} ha sido abandonado`),
            },
          },
        },
        GUILD_NOT_FOUND: ({
          guildId,
        }: {
          guildId: string;
        }) => bold(`${Emojis.CANCEL} El servidor ${inlineCode(guildId)} no ha sido encontrado`),
        MESSAGE_1: {
          TITLE_1: bold("Información del Servidor"),
          FIELD_1: {
            NAME: "Información General",
            VALUE: ({
              guildId,
              guildName,
            }: {
              guildId: string;
              guildName: string;
            }) => codeBlock("ansi", formatKeyValues([`Nombre » ${guildName}`, `ID » ${guildId}`].join("\n"), "»")),
          },
          FIELD_2: {
            NAME: "Estadísticas",
            VALUE: ({
              channelCount,
              memberCount,
            }: {
              memberCount: number;
              channelCount: number;
            }) =>
              codeBlock(
                "ansi",
                formatKeyValues(
                  [`N.º de Miembros » ${memberCount}`, `N.º de Canales » ${channelCount}`].join("\n"),
                  "»",
                ),
              ),
          },
          FIELD_3: {
            NAME: "Fecha de Creación",
            VALUE: ({
              createdAt,
            }: {
              createdAt: Date;
            }) =>
              codeBlock("ansi", colors.bold.magenta(formatTimestamp(createdAt, "dddd[, ]MMMM DD[, ]YYYY[, ]HH:mm"))),
          },
          FIELD_4: {
            NAME: "Fecha de Membresía del Bot",
            VALUE: ({
              joinedAt,
            }: {
              joinedAt: Date;
            }) => codeBlock("ansi", colors.bold.magenta(formatTimestamp(joinedAt, "dddd[, ]MMMM DD[, ]YYYY[, ]HH:mm"))),
          },
        },
      },
    },
    INFORMATION: {
      DEBUG: {
        COMPONENTS: {
          BUTTONS: {
            PROCESS: {
              LABEL: "Proceso",
              MESSAGE_1: {
                TITLE_1: bold("Información del Proceso"),
                FIELD_1: {
                  NAME: "Memoria RAM Utilizada",
                  VALUE: ({
                    totalMemory,
                    usedMemory,
                  }: {
                    totalMemory: number;
                    usedMemory: number;
                  }) =>
                    codeBlock(
                      "ansi",
                      colors.bold.magenta(
                        `${createProgressBar(usedMemory, totalMemory, 13)} [${usedMemory}mb/${totalMemory}mb]`,
                      ),
                    ),
                },
              },
            },
          },
        },
        MESSAGE_1: {
          TITLE_1: bold("Información de la Depuración"),
          FIELD_1: {
            NAME: "Información General",
            VALUE: ({
              developer,
              version,
            }: {
              developer: string;
              version: string;
            }) =>
              codeBlock(
                "ansi",
                formatKeyValues([`Versión » ${version}`, `Desarrollador » ${developer}`].join("\n"), "»"),
              ),
          },
          FIELD_2: {
            NAME: "Estadísticas",
            VALUE: ({
              guildCount,
              shardCount,
              userCount,
            }: {
              guildCount: number;
              shardCount: number;
              userCount: number;
            }) =>
              codeBlock(
                "ansi",
                formatKeyValues(
                  [
                    `N.º de Servidores » ${guildCount}`,
                    `N.º de Usuarios » ${userCount}`,
                    `N.º de Shards » ${shardCount}`,
                  ].join("\n"),
                  "»",
                ),
              ),
          },
          FIELD_3: {
            NAME: "Fecha del Último Reinicio",
            VALUE: ({
              lastResetDate,
            }: {
              lastResetDate: Date;
            }) =>
              codeBlock(
                "ansi",
                colors.bold.magenta(formatTimestamp(lastResetDate, "dddd[, ]MMMM DD[, ]YYYY[, ]HH:mm")),
              ),
          },
        },
      },
      PING: {
        MESSAGE_1: {
          FIELD_1: {
            NAME: "Referencia REST",
            VALUE: ({
              restLatency,
            }: {
              restLatency: number;
            }) => codeBlock("ansi", colors.bold.magenta(`${restLatency}ms`)),
          },
          FIELD_2: {
            NAME: "Shard del Servidor",
            VALUE: ({
              shardLatency,
            }: {
              shardLatency: number;
            }) => codeBlock("ansi", colors.bold.magenta(`${shardLatency}ms`)),
          },
        },
      },
    },
    UTILITY: {
      SOURCE: {
        COMPONENTS: {
          BUTTONS: {
            DELETE: {
              LABEL: "Eliminar",
            },
          },
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
        `${Emojis.CANCEL} Tu número máximo de interacciones ha sido limitada\n${Emojis.ARROW_CIRCLE_RIGHT} El límite se restablecerá dentro de ${resets}`,
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
    SOMETHING_WENT_WRONG: ({
      reportId,
    }: {
      reportId: string;
    }) =>
      [
        bold(`${Emojis.REPORT} No se ha podido realizar esta acción debido a un error inesperado`),
        bold(`${Emojis.ARROW_CIRCLE_RIGHT} Por favor, reporte el error con la siguiente ID: ${inlineCode(reportId)}`),
      ].join("\n"),
  },
  PERMISSIONS: permissions,
};
