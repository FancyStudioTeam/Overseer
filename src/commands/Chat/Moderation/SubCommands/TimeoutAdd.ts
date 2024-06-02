import { Duration } from "@sapphire/time-utilities";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { ComparationLevel, compareMemberToMember, errorMessage, sanitizeString } from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
    name: "timeout_add",
    permissions: {
        user: ["MODERATE_MEMBERS"],
        bot: ["MODERATE_MEMBERS"],
    },
    directory: Directory.MODERATION,
    run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
        if (!(_context.inCachedGuildChannel() && _context.guild)) {
            return await errorMessage({
                _context,
                ephemeral: true,
                message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
                    structure: _context,
                }),
            });
        }

        const _memberOption = _context.data.options.getMember("user");
        const _durationOption = _context.data.options.getString("duration", true);
        const _reasonOption = sanitizeString(_context.data.options.getString("reason") ?? "No reason", {
            maxLength: 50,
            espaceMarkdown: true,
        });

        if (!_memberOption) {
            return await errorMessage({
                _context,
                ephemeral: true,
                message: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
            });
        }

        if (
            _memberOption.id === _client.user.id ||
            _memberOption.id === _context.guild.ownerID ||
            _memberOption.id === _context.user.id
        ) {
            return await errorMessage({
                _context,
                ephemeral: true,
                message: Translations[locale].GLOBAL.CANNOT_MODERATE_MEMBER,
            });
        }

        if (compareMemberToMember(_context.guild.clientMember, _memberOption) !== ComparationLevel.HIGHER) {
            return await errorMessage({
                _context,
                ephemeral: true,
                message: Translations[locale].GLOBAL.HIERARCHY.CLIENT,
            });
        }

        if (
            _context.user.id !== _context.guild.ownerID &&
            compareMemberToMember(_context.member, _memberOption) !== ComparationLevel.HIGHER
        ) {
            return await errorMessage({
                _context,
                ephemeral: true,
                message: Translations[locale].GLOBAL.HIERARCHY.USER,
            });
        }

        const parsedDuration = new Duration(_durationOption).offset;

        if (Number.isNaN(parsedDuration)) {
            return await errorMessage({
                _context,
                ephemeral: true,
                message: Translations[locale].COMMANDS.MODERATION.TIMEOUT.ADD.INVALID_DURATION_FORMAT,
            });
        }

        if (parsedDuration < new Duration("5 seconds").offset || parsedDuration > new Duration("28 days").offset) {
            return await errorMessage({
                _context,
                ephemeral: true,
                message: Translations[locale].COMMANDS.MODERATION.TIMEOUT.ADD.ALLOWED_DURATION_VALUES,
            });
        }

        await _client.rest.guilds.editMember(_context.guildID, _memberOption.id, {
            communicationDisabledUntil: new Date(Date.now() + parsedDuration).toISOString(),
            reason: _reasonOption,
        });

        await _context.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        Translations[locale].COMMANDS.MODERATION.TIMEOUT.ADD.MESSAGE_1({
                            user: _memberOption.mention,
                            moderator: _context.user.mention,
                            reason: _reasonOption,
                        }),
                    )
                    .setColor(Colors.SUCCESS)
                    .toJSON(),
            ],
        });
    },
});
