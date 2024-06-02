import { ApplicationCommandOptionTypes, ApplicationCommandTypes, type CommandInteraction } from "oceanic.js";
import { BaseBuilder } from "#builders";
import type { Discord } from "#client";
import { type ChatInputCommandInterface, Directory } from "#types";

export default new BaseBuilder<ChatInputCommandInterface>({
    name: "info",
    description: "_",
    options: [
        {
            name: "bot",
            description: "Displays bot information",
            descriptionLocalizations: {
                "es-419": "Muestra la información del bot",
                "es-ES": "Muestra la información del bot",
            },
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: "ping",
            description: "Displays bot latency",
            descriptionLocalizations: {
                "es-419": "Muestra la latencia del bot",
                "es-ES": "Muestra la latencia del bot",
            },
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: "server",
            description: "Displays server information",
            descriptionLocalizations: {
                "es-419": "Muestra la información del servidor",
                "es-ES": "Muestra la información del servidor",
            },
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
            name: "user",
            description: "Displays a user's information",
            descriptionLocalizations: {
                "es-419": "Muestra la información del usuario",
                "es-ES": "Muestra la información del usuario",
            },
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
                {
                    name: "user",
                    description: "User mention or ID",
                    descriptionLocalizations: {
                        "es-419": "Mención del usuario o ID",
                        "es-ES": "Mención del usuario o ID",
                    },
                    type: ApplicationCommandOptionTypes.USER,
                },
            ],
        },
    ],
    type: ApplicationCommandTypes.CHAT_INPUT,
    dmPermission: false,
    directory: Directory.INFORMATION,
    run: async (_client: Discord, _context: CommandInteraction) => null,
});
