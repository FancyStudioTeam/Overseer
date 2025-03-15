import {
  type ActionRow,
  type ButtonComponent,
  ButtonStyles,
  type DiscordEmbed,
  type EmbedField,
  MessageComponentTypes,
  type SelectMenuComponent,
  type SelectOption,
  bold,
  magenta,
} from "@discordeno/bot";
import { codeBlock } from "@discordjs/formatters";
import { formatAnsiKeyValues } from "@functions/formatAnsiKeyValue.js";
import { formatTimestamp } from "@functions/formatTimestamp.js";
import { parseEmoji } from "@functions/parseEmoji.js";
import type { KanbanBoard, KanbanBoardSection } from "@services/kanbanBoard/KanbanBoardService.js";
import { DEFAULT_EMBED_COLOR, OAUTH2_INVITE_URL } from "@util/constants.js";
import type { AnyMessagePayload } from "@util/types.js";
import type { TFunction } from "i18next";

export class KanbanBoardDiscordService {
  /**
   * Gets the components for the Kanban board information.
   * @param kanbanBoard - The Kanban board object.
   * @param t - The function to translate the command messages.
   * @returns An array containing the action row object for the Kanban board information.
   */
  private getKanbanBoardConfigurationComponents(kanbanBoard: KanbanBoard, t: TFunction<"commands">): ActionRow[] {
    const { id: boardId } = kanbanBoard;
    const [boardTitleButton, boardSectionsButton, boardAdministratorsButton, boardDeleteButton]: ButtonComponent[] = [
      {
        customId: `@kanban_board/title#[${boardId}]`,
        emoji: parseEmoji("BOOK_TYPE"),
        label: t("utility.kanban.board.manage.components.board_title_button.label"),
        style: ButtonStyles.Secondary,
        type: MessageComponentTypes.Button,
      },
      {
        customId: `@kanban_board/manage_sections#[${boardId}]`,
        emoji: parseEmoji("LAYOUT_GRID"),
        label: t("utility.kanban.board.manage.components.manage_sections_button.label"),
        style: ButtonStyles.Secondary,
        type: MessageComponentTypes.Button,
      },
      {
        customId: `@kanban_board/manage_users#[${boardId}]`,
        emoji: parseEmoji("USERS"),
        label: t("utility.kanban.board.manage.components.manage_users_button.label"),
        style: ButtonStyles.Secondary,
        type: MessageComponentTypes.Button,
      },
      {
        customId: `@kanban_board/delete_board#[${boardId}]`,
        emoji: parseEmoji("TRASH_2"),
        label: t("utility.kanban.board.manage.components.delete_board_button.label"),
        style: ButtonStyles.Danger,
        type: MessageComponentTypes.Button,
      },
    ];
    const kanbanBoardInformationButtonsActionRow: ActionRow = {
      components: [boardTitleButton, boardSectionsButton, boardAdministratorsButton, boardDeleteButton],
      type: MessageComponentTypes.ActionRow,
    };

    return [kanbanBoardInformationButtonsActionRow];
  }

  /**
   * Gets the embeds for the Kanban board information.
   * @param kanbanBoard - The Kanban board object.
   * @param t - The function to translate the command messages.
   * @returns An array containing the embed objects for the Kanban board information.
   */
  private getKanbanBoardInformationEmbeds(kanbanBoard: KanbanBoard, t: TFunction<"commands">): DiscordEmbed[] {
    const { id: boardId, title: boardTitle, createdAt: boardCreatedAt, updatedAt: boardUpdatedAt } = kanbanBoard;
    const formattedBoardCreatedAt = formatTimestamp(boardCreatedAt);
    const formattedBoardUpdatedAt = formatTimestamp(boardUpdatedAt);
    const [generalInformationField, creationDateField, lastUpdateField]: EmbedField[] = [
      {
        name: t("utility.kanban.board.manage.embeds.information_embed.general_information_field.name"),
        value: codeBlock(
          "ansi",
          formatAnsiKeyValues(
            t("utility.kanban.board.manage.embeds.information_embed.general_information_field.value", {
              boardCreatedAt: formattedBoardCreatedAt,
              boardId,
              boardTitle,
            }),
          ),
        ),
      },
      {
        name: t("utility.kanban.board.manage.embeds.information_embed.creation_date_field.name"),
        value: codeBlock("ansi", magenta(bold(formattedBoardCreatedAt))),
      },
      {
        name: t("utility.kanban.board.manage.embeds.information_embed.last_update_field.name"),
        value: codeBlock("ansi", magenta(bold(formattedBoardUpdatedAt))),
      },
    ];
    const kanbanBoardInformationEmbed: DiscordEmbed = {
      color: DEFAULT_EMBED_COLOR,
      fields: [generalInformationField, creationDateField, lastUpdateField],
      title: t("utility.kanban.board.manage.embeds.information_embed.title"),
      url: OAUTH2_INVITE_URL,
    };

    return [kanbanBoardInformationEmbed];
  }

  /**
   * Gets the Kanban board information payload object.
   * @param kanbanBoard - The Kanban board object.
   * @param t - The function to translate the command messages.
   * @returns The Kanban board information payload object.
   */
  getKanbanBoardInformationPayload(kanbanBoard: KanbanBoard, t: TFunction<"commands">): AnyMessagePayload {
    const components = this.getKanbanBoardConfigurationComponents(kanbanBoard, t);
    const embeds = this.getKanbanBoardInformationEmbeds(kanbanBoard, t);
    const messagePayload: AnyMessagePayload = {
      components,
      embeds,
    };

    return messagePayload;
  }

  /**
   * Gets the components for the Kanban board section configuration.
   * @param kanbanBoardSection - The Kanban board section object.
   * @param t - The function to translate the command messages.
   * @returns An array containing the action row object for the Kanban board section configuration.
   */
  private getKanbanBoardSectionConfigurationComponents(
    kanbanBoardSection: KanbanBoardSection,
    t: TFunction<"commands">,
  ): ActionRow[] {
    const { id: sectionId } = kanbanBoardSection;
    const [editSectionButton, changePositionButton, deleteSectionButton]: ButtonComponent[] = [
      {
        customId: `@kanban_board/edit_section#[${sectionId}]`,
        emoji: parseEmoji("BOLT"),
        label: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.components.edit_section_button.label",
        ),
        style: ButtonStyles.Secondary,
        type: MessageComponentTypes.Button,
      },
      {
        customId: `@kanban_board/change_position#[${sectionId}]`,
        emoji: parseEmoji("BOLT"),
        label: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.components.change_position_button.label",
        ),
        style: ButtonStyles.Secondary,
        type: MessageComponentTypes.Button,
      },
      {
        customId: `@kanban_board/delete_section#[${sectionId}]`,
        emoji: parseEmoji("TRASH_2"),
        label: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.components.delete_section_button.label",
        ),
        style: ButtonStyles.Danger,
        type: MessageComponentTypes.Button,
      },
    ];
    const kanbanBoardSectionConfigurationButtonsActionRow: ActionRow = {
      components: [editSectionButton, changePositionButton, deleteSectionButton],
      type: MessageComponentTypes.ActionRow,
    };

    return [kanbanBoardSectionConfigurationButtonsActionRow];
  }

  /**
   * Gets the embeds for the Kanban board section information.
   * @param kanbanBoardSection - The Kanban board section object.
   * @param t - The function to translate the command messages.
   * @returns An array containing the embed objects for the Kanban board section information.
   */
  private getKanbanBoardSectionInformationEmbeds(
    kanbanBoardSection: KanbanBoardSection,
    t: TFunction<"commands">,
  ): DiscordEmbed[] {
    const {
      id: sectionId,
      position: sectionPosition,
      title: sectionTitle,
      createdAt: sectionCreatedAt,
      updatedAt: sectionUpdatedAt,
    } = kanbanBoardSection;
    const formattedSectionCreatedAt = formatTimestamp(sectionCreatedAt);
    const formattedSectionUpdatedAt = formatTimestamp(sectionUpdatedAt);
    const [generalInformationField, creationDateField, lastUpdateField]: EmbedField[] = [
      {
        name: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.embeds.information_embed.general_information_field.name",
        ),
        value: codeBlock(
          "ansi",
          formatAnsiKeyValues(
            t(
              "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.embeds.information_embed.general_information_field.value",
              {
                sectionId,
                sectionPosition,
                sectionTitle,
              },
            ),
          ),
        ),
      },
      {
        name: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.embeds.information_embed.creation_date_field.name",
        ),
        value: codeBlock("ansi", magenta(bold(formattedSectionCreatedAt))),
      },
      {
        name: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.embeds.information_embed.last_update_field.name",
        ),
        value: codeBlock("ansi", magenta(bold(formattedSectionUpdatedAt))),
      },
    ];
    const kanbanBoardSectionInformationEmbed: DiscordEmbed = {
      color: DEFAULT_EMBED_COLOR,
      fields: [generalInformationField, creationDateField, lastUpdateField],
      title: t(
        "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.embeds.information_embed.title",
      ),
      url: OAUTH2_INVITE_URL,
    };

    return [kanbanBoardSectionInformationEmbed];
  }

  getKanbanBoardSectionInformationPayload(
    kanbanBoardSection: KanbanBoardSection,
    t: TFunction<"commands">,
  ): AnyMessagePayload {
    const components = this.getKanbanBoardSectionConfigurationComponents(kanbanBoardSection, t);
    const embeds = this.getKanbanBoardSectionInformationEmbeds(kanbanBoardSection, t);
    const messagePayload: AnyMessagePayload = {
      components,
      embeds,
    };

    return messagePayload;
  }

  /**
   * Gets the components for the Kanban board sections.
   * @param kanbanBoard - The Kanban board object.
   * @param t - The function to translate the command messages.
   * @returns An array containing the action row object for the Kanban board sections.
   */
  private getKanbanBoardSectionsComponents(kanbanBoard: KanbanBoard, t: TFunction<"commands">): ActionRow[] {
    const { id: boardId, sections: boardSections } = kanbanBoard;
    const boardSectionOptions: SelectOption[] = boardSections.map((section) => {
      const { title: sectionTitle, id: sectionId } = section;
      const boardSectionOption: SelectOption = {
        emoji: parseEmoji("BOLT"),
        label: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.options.section_option.label",
          {
            sectionTitle,
          },
        ),
        value: sectionId,
      };

      return boardSectionOption;
    });
    const [manageKanbanBoardSectionsDropdown]: SelectMenuComponent[] = [
      {
        type: MessageComponentTypes.SelectMenu,
        customId: `@kanban_board/manage_section#[${boardId}]`,
        placeholder: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.placeholder",
        ),
        options: boardSectionOptions,
      },
    ];
    const [createSectionButton]: ButtonComponent[] = [
      {
        customId: `@kanban_board/create_section#[${boardId}]`,
        emoji: parseEmoji("CIRCLE_PLUS"),
        label: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.create_section_button.label",
        ),
        style: ButtonStyles.Secondary,
        type: MessageComponentTypes.Button,
      },
    ];
    const kanbanBoardSectionsDropdownsActionRow: ActionRow = {
      components: [manageKanbanBoardSectionsDropdown],
      type: MessageComponentTypes.ActionRow,
    };
    const kanbanBoardSectionsButtonsActionRow: ActionRow = {
      components: [createSectionButton],
      type: MessageComponentTypes.ActionRow,
    };

    return [kanbanBoardSectionsDropdownsActionRow, kanbanBoardSectionsButtonsActionRow];
  }

  /**
   * Gets the embeds for the Kanban board sections.
   * @param kanbanBoard - The Kanban board object.
   * @param t - The function to translate the command messages.
   * @param tasksCount - The number of tasks in the Kanban board section.
   * @returns An array containing the embed objects for the Kanban board sections.
   */
  private getKanbanBoardSectionsEmbeds(kanbanBoard: KanbanBoard, t: TFunction<"commands">): DiscordEmbed[] {
    const { sections: boardSections } = kanbanBoard;
    const boardSectionsList = boardSections
      .map((section) => {
        const { position: sectionPosition, title: sectionTitle } = section;
        const boardSectionDescription = t(
          "utility.kanban.board.manage.components.manage_sections_button.embeds.information_embed.description",
          {
            sectionPosition,
            sectionTitle,
          },
        );

        return boardSectionDescription;
      })
      .join("\n");
    const kanbanBoardSectionsEmbed: DiscordEmbed = {
      color: DEFAULT_EMBED_COLOR,
      description: codeBlock("ansi", formatAnsiKeyValues(boardSectionsList)),
      title: t("utility.kanban.board.manage.components.manage_sections_button.embeds.information_embed.title"),
      url: OAUTH2_INVITE_URL,
    };

    return [kanbanBoardSectionsEmbed];
  }

  /**
   * Gets the Kanban board sections payload object.
   * @param kanbanBoard - The Kanban board object.
   * @param t - The function to translate the command messages.
   * @param tasksCount - The number of tasks in the Kanban board section.
   * @returns The Kanban board sections payload object.
   */
  getKanbanBoardSectionsPayload(kanbanBoard: KanbanBoard, t: TFunction<"commands">): AnyMessagePayload {
    const components = this.getKanbanBoardSectionsComponents(kanbanBoard, t);
    const embeds = this.getKanbanBoardSectionsEmbeds(kanbanBoard, t);
    const messagePayload: AnyMessagePayload = {
      components,
      embeds,
    };

    return messagePayload;
  }
}
