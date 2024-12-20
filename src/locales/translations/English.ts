import colors from "@colors/colors";
import { Emojis } from "@constants";
import { bold, codeBlock, inlineCode } from "@discordjs/formatters";
import { createProgressBar, formatKeyValues, formatTimestamp } from "@util/utils";
import type { PermissionName } from "oceanic.js";

const permissions: Record<PermissionName, string> = {
  ADD_REACTIONS: "Add Reactions",
  ADMINISTRATOR: "Administrator",
  ATTACH_FILES: "Attach Files",
  BAN_MEMBERS: "Ban Members",
  CHANGE_NICKNAME: "Change Nickname",
  CONNECT: "Connect",
  CREATE_EVENTS: "Create Events",
  CREATE_GUILD_EXPRESSIONS: "Create Server Expressions",
  CREATE_INSTANT_INVITE: "Create Instant Invite",
  CREATE_PRIVATE_THREADS: "Create Private Threads",
  CREATE_PUBLIC_THREADS: "Create Public Threads",
  DEAFEN_MEMBERS: "Deafen Members",
  EMBED_LINKS: "Embed Links",
  KICK_MEMBERS: "Kick Members",
  MANAGE_CHANNELS: "Manage Channels",
  MANAGE_EVENTS: "Manage Events",
  MANAGE_GUILD: "Manage Server",
  MANAGE_GUILD_EXPRESSIONS: "Manage Server Expressions",
  MANAGE_MESSAGES: "Manage Messages",
  MANAGE_NICKNAMES: "Manage Nicknames",
  MANAGE_ROLES: "Manage Roles",
  MANAGE_THREADS: "Manage Threads",
  MANAGE_WEBHOOKS: "Manage Webhooks",
  MENTION_EVERYONE: "Mention Everyone",
  MODERATE_MEMBERS: "Moderate Members",
  MOVE_MEMBERS: "Move Members",
  MUTE_MEMBERS: "Mute Members",
  PRIORITY_SPEAKER: "Priority Speaker",
  READ_MESSAGE_HISTORY: "Read Message History",
  REQUEST_TO_SPEAK: "Request to Speak",
  SEND_MESSAGES: "Send Messages",
  SEND_MESSAGES_IN_THREADS: "Send Messages in Threads",
  SEND_POLLS: "Send Polls",
  SEND_TTS_MESSAGES: "Send TTS Messages",
  SEND_VOICE_MESSAGES: "Send Voice Messages",
  SET_VOICE_CHANNEL_STATUS: "Set Voice Channel Status",
  SPEAK: "Speak",
  STREAM: "Share Screen",
  USE_APPLICATION_COMMANDS: "Use Application Commands",
  USE_CLYDE_AI: "Use Clyde AI",
  USE_EMBEDDED_ACTIVITIES: "Use Embedded Activities",
  USE_EXTERNAL_APPS: "Use External Apps",
  USE_EXTERNAL_EMOJIS: "Use External Emojis",
  USE_EXTERNAL_SOUNDS: "Use External Sounds",
  USE_EXTERNAL_STICKERS: "Use External Stickers",
  USE_SOUNDBOARD: "Use Soundboard",
  USE_VAD: "Use VAD",
  VIEW_AUDIT_LOG: "View Audit Log",
  VIEW_CHANNEL: "View Channel",
  VIEW_CREATOR_MONETIZATION_ANALYTICS: "View Creator Monetization Analytics",
  VIEW_GUILD_INSIGHTS: "View Server Insights",
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
              bold(`${Emojis.CANCEL_COLORED} An error has occurred while parsing the file`),
              codeBlock("ts", errorMessage),
            ].join("\n"),
          MAXIMUM_SIZE_ALLOWED: ({
            maximum,
          }: {
            maximum: number;
          }) =>
            [
              bold(`${Emojis.CANCEL_COLORED} The automation has exceeded the allowed size limit`),
              bold(
                `${Emojis.ARROW_CIRCLE_RIGHT} The size limit allowed per automation is ${inlineCode(`${maximum.toString()}kb`)}`,
              ),
            ].join("\n"),
          MAXIMUM_AUTOMATIONS_ALLOWED: ({
            maximum,
          }: {
            maximum: number;
          }) =>
            [
              bold(`${Emojis.CANCEL_COLORED} The server has exceeded the limit of allowed automations`),
              bold(
                `${Emojis.ARROW_CIRCLE_RIGHT} The limit of allowed automations per server is ${inlineCode(maximum.toString())}`,
              ),
            ].join("\n"),
          MESSAGE_1: ({
            automationName,
          }: {
            automationName: string;
          }) => bold(`${Emojis.CHECK_CIRCLE_COLORED} The automation ${inlineCode(automationName)} has been created`),
        },
        DELETE: {
          AUTOMATION_NOT_FOUND: ({
            automationId,
          }: {
            automationId: string;
          }) => bold(`${Emojis.CANCEL_COLORED} The automation ${inlineCode(automationId)} has not been found`),
          MESSAGE_1: ({
            automationName,
          }: {
            automationName: string;
          }) => bold(`${Emojis.CHECK_CIRCLE_COLORED} The automation ${inlineCode(automationName)} has been deleted`),
        },
        LIST: {
          COMPONENTS: {
            AUTOMATION_NOT_FOUND: ({
              automationId,
            }: {
              automationId: string;
            }) => bold(`${Emojis.CANCEL_COLORED} The automation ${inlineCode(automationId)} has not been found`),
            BUTTONS: {
              DISPLAY: {
                LABEL: "Display Code",
              },
              DOWNLOAD: {
                LABEL: "Download Code",
              },
              DELETE: {
                LABEL: "Delete Automation",
                MESSAGE_1: ({
                  automationName,
                }: {
                  automationName: string;
                }) =>
                  bold(`${Emojis.CHECK_CIRCLE_COLORED} The automation ${inlineCode(automationName)} has been deleted`),
              },
            },
          },
          NO_AVAILABLE_AUTOMATIONS: bold(`${Emojis.CANCEL_COLORED} The server has no automations available`),
          MESSAGE_1: {
            TITLE_1: bold("Automation Information"),
            FIELD_1: {
              NAME: "General Information",
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
                    [`Name » ${automationName}`, `ID » ${automationId}`, `Created By » ${createdBy}`].join("\n"),
                    "»",
                  ),
                ),
            },
            FIELD_2: {
              NAME: "Creation Date",
              VALUE: ({
                createdAt,
              }: {
                createdAt: Date;
              }) =>
                codeBlock("ansi", colors.bold.magenta(formatTimestamp(createdAt, "dddd[, ]MMMM DD[, ]YYYY[, ]HH:mm"))),
            },
            FIELD_3: {
              NAME: "Automation Size",
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
        MESSAGE_1: bold(`${Emojis.CHECK_CIRCLE_COLORED} The bot language has been set to ${inlineCode("English")}.`),
      },
      MEMBERSHIP: {
        REEDEM: {
          MEMBERSHIP_NOT_FOUND: ({
            membershipId,
          }: {
            membershipId: string;
          }) => bold(`${Emojis.CANCEL_COLORED} The membership ${inlineCode(membershipId)} has not been found`),
          MESSAGE_1: ({
            membershipId,
          }: {
            membershipId: string;
          }) => bold(`${Emojis.CHECK_CIRCLE_COLORED} The membership ${inlineCode(membershipId)} has been reedemed`),
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
              }) => `Took ${executionTime}ms`,
            },
            DELETE: {
              LABEL: "Delete",
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
              }) => `Took ${executionTime}ms`,
            },
            DELETE: {
              LABEL: "Delete",
            },
          },
        },
      },
      LOOKUP_GUILD: {
        COMPONENTS: {
          BUTTONS: {
            OWNER: {
              LABEL: "Owner",
              UNABLE_VALID_OWNER: bold(`${Emojis.CANCEL_COLORED} Unable to obtain the server owner`),
              MESSAGE_1: {
                TITLE: bold("Owner Information"),
                FIELD_1: {
                  NAME: "General Information",
                  VALUE: ({
                    userId,
                    userName,
                  }: {
                    userId: string;
                    userName: string;
                  }) => codeBlock("ansi", formatKeyValues([`Name » ${userName}`, `ID » ${userId}`].join("\n"), "»")),
                },
                FIELD_2: {
                  NAME: "Creation Date",
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
              LABEL: "Generate Invite",
              OBTAIN_VALID_CHANNEL: bold(`${Emojis.CANCEL_COLORED} Unable to obtain a valid channel`),
            },
            LEAVE: {
              LABEL: "Leave Server",
              MESSAGE_1: ({
                guildName,
              }: {
                guildName: string;
              }) => bold(`${Emojis.CHECK_CIRCLE_COLORED} The server ${inlineCode(guildName)} has been left`),
            },
          },
        },
        GUILD_NOT_FOUND: ({
          guildId,
        }: {
          guildId: string;
        }) => bold(`${Emojis.CANCEL_COLORED} The server ${inlineCode(guildId)} has not been found`),
        MESSAGE_1: {
          TITLE_1: bold("Server Information"),
          FIELD_1: {
            NAME: "General Information",
            VALUE: ({
              guildId,
              guildName,
            }: {
              guildId: string;
              guildName: string;
            }) => codeBlock("ansi", formatKeyValues([`Name » ${guildName}`, `ID » ${guildId}`].join("\n"), "»")),
          },
          FIELD_2: {
            NAME: "Statistics",
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
                  [`No. of Members » ${memberCount}`, `No. of Channels » ${channelCount}`].join("\n"),
                  "»",
                ),
              ),
          },
          FIELD_3: {
            NAME: "Creation Date",
            VALUE: ({
              createdAt,
            }: {
              createdAt: Date;
            }) =>
              codeBlock("ansi", colors.bold.magenta(formatTimestamp(createdAt, "dddd[, ]MMMM DD[, ]YYYY[, ]HH:mm"))),
          },
          FIELD_4: {
            NAME: "Bot Membership Date",
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
              LABEL: "Process",
              MESSAGE_1: {
                TITLE_1: bold("Process Information"),
                FIELD_1: {
                  NAME: "RAM Memory Used",
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
          TITLE_1: bold("Debugging Information"),
          FIELD_1: {
            NAME: "General Information",
            VALUE: ({
              developer,
              version,
            }: {
              developer: string;
              version: string;
            }) =>
              codeBlock("ansi", formatKeyValues([`Version » ${version}`, `Developer » ${developer}`].join("\n"), "»")),
          },
          FIELD_2: {
            NAME: "Statistics",
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
                    `No. of Servers » ${guildCount}`,
                    `No. of Users » ${userCount}`,
                    `No. of Shards » ${shardCount}`,
                  ].join("\n"),
                  "»",
                ),
              ),
          },
          FIELD_3: {
            NAME: "Last Reset Date",
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
      HELP: {
        COMPONENTS: {
          SELECT_MENUS: {
            CATEGORIES: {
              PLACEHOLDER: "Select a command category",
              COMMAND_NOT_FOUND: ({
                commandName,
              }: {
                commandName: string;
              }) => bold(`${Emojis.CANCEL_COLORED} The command ${inlineCode(commandName)} has not been found`),
            },
          },
        },
        MESSAGE_1: {
          DESCRIPTION_1: [
            bold(`${Emojis.OWL} Welcome to the Discord Overseer bot`),
            bold(`${Emojis.ARROW_CIRCLE_RIGHT} You can select a category to view its commands`),
          ].join("\n"),
        },
      },
      PING: {
        MESSAGE_1: {
          FIELD_1: {
            NAME: "REST Reference",
            VALUE: ({
              restLatency,
            }: {
              restLatency: number;
            }) => codeBlock("ansi", colors.bold.magenta(`${restLatency}ms`)),
          },
          FIELD_2: {
            NAME: "Server Shard",
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
              LABEL: "Delete",
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
        `${Emojis.CANCEL_COLORED} Your maximum number of interactions has been limited\n${Emojis.ARROW_CIRCLE_RIGHT} The limit will be reestablished within ${resets}`,
      ),
    PERMISSIONS: {
      GUILD: {
        USER: ({
          permissions,
        }: {
          permissions: string;
        }) =>
          [
            bold(`${Emojis.CANCEL_COLORED} You need the following permissions on the server:`),
            codeBlock("ansi", colors.bold.magenta(permissions)),
          ].join("\n"),
        CLIENT: ({
          permissions,
        }: {
          permissions: string;
        }) =>
          [
            bold(`${Emojis.CANCEL_COLORED} I need the following permissions on the server:`),
            codeBlock("ansi", colors.bold.magenta(permissions)),
          ].join("\n"),
      },
      CHANNEL: {
        USER: ({
          channelMention,
          permissions,
        }: {
          channelMention: string;
          permissions: string;
        }) =>
          [
            bold(`${Emojis.CANCEL_COLORED} You need the following permissions on the ${channelMention} channel:`),
            codeBlock("ansi", colors.bold.magenta(permissions)),
          ].join("\n"),
        CLIENT: ({
          channelMention,
          permissions,
        }: {
          channelMention: string;
          permissions: string;
        }) =>
          [
            bold(`${Emojis.CANCEL_COLORED} I need the following permissions on the ${channelMention} channel:`),
            codeBlock("ansi", colors.bold.magenta(permissions)),
          ].join("\n"),
      },
    },
    INVALID_USER_COLLECTOR: bold(`${Emojis.CANCEL_COLORED} You cannot run another user's components.`),
    SOMETHING_WENT_WRONG: bold(`${Emojis.REPORT_COLORED} Something went wrong while performing the action...`),
  },
  PERMISSIONS: permissions,
};
