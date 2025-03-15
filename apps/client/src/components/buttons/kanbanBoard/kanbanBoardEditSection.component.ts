import { type InteractionResponse, InteractionResponseTypes, MessageComponentTypes, TextStyles } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { type KanbanBoardSection, KanbanBoardService } from "@services/kanbanBoard/KanbanBoardService.js";
import { ButtonComponent, type ButtonComponentRunOptions } from "@structures/components/ButtonComponent.js";
import { client } from "@util/client.js";
import { Declare } from "@util/decorators.js";
import type { TFunction } from "i18next";

@Declare({
  customId: "@kanban_board/edit_section",
})
export default class KanbanBoardEditSectionComponent extends ButtonComponent {
  kanbanBoardService = new KanbanBoardService();

  /**
   * The method to execute when the button is pressed.
   * @param options - The available options.
   */
  async _run(options: ButtonComponentRunOptions): Promise<unknown> {
    const { context, t, values } = options;
    const [sectionIdFromCustomId] = values;
    const { kanbanBoardService } = this;
    const kanbanBoardSection = await kanbanBoardService.getKanbanBoardSection(sectionIdFromCustomId);

    if (!kanbanBoardSection) {
      return await createMessage(
        context,
        t("utility.kanban.board.manage.components.manage_sections_button.kanban_board_section_not_found", {
          sectionId: sectionIdFromCustomId,
        }),
      );
    }

    const { board } = kanbanBoardSection;
    const { id: boardId } = board;
    const kanbanBoard = await kanbanBoardService.getKanbanBoard(boardId);

    if (!kanbanBoard) {
      return await createMessage(context, t("utility.kanban.board.manage.kanban_board_not_found"));
    }

    const { id, token, user } = context;
    const { id: userId } = user;
    const userCanManageKanbanBoard = kanbanBoardService.checkKanbanBoardUserPermissions(kanbanBoard, userId);

    if (!userCanManageKanbanBoard) {
      return await createMessage(context, t("utility.kanban.board.manage.user_cannot_manage_kanban_board"));
    }

    const { helpers } = client;
    const modalInteractionResponse = this.getModalInteractionResponse(kanbanBoardSection, t);

    return await helpers.sendInteractionResponse(id, token, modalInteractionResponse);
  }

  /**
   * Gets the modal interaction response object.
   * @param kanbanBoardSection - The Kanban board section object.
   * @param t - The function to translate the command messages.
   * @returns An object containing the modal interaction response.
   */
  getModalInteractionResponse(kanbanBoardSection: KanbanBoardSection, t: TFunction<"commands">): InteractionResponse {
    const { id: sectionId, title: sectionTitle, description: sectionDescription } = kanbanBoardSection;
    const interactionResponse: InteractionResponse = {
      data: {
        components: [
          {
            components: [
              {
                customId: "title",
                label: t(
                  "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.components.edit_section_button.components.edit_section_modal.section_title_input.label",
                ),
                maxLength: 35,
                minLength: 3,
                required: true,
                style: TextStyles.Short,
                type: MessageComponentTypes.InputText,
                value: sectionTitle,
              },
            ],
            type: MessageComponentTypes.ActionRow,
          },
          {
            components: [
              {
                customId: "description",
                label: t(
                  "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.components.edit_section_button.components.edit_section_modal.section_description_input.label",
                ),
                maxLength: 150,
                required: false,
                style: TextStyles.Paragraph,
                type: MessageComponentTypes.InputText,
                value: sectionDescription,
              },
            ],
            type: MessageComponentTypes.ActionRow,
          },
        ],
        customId: `@kanban_board/edit_section#[${sectionId}]`,
        title: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.manage_section_dropdown.components.edit_section_button.components.edit_section_modal.title",
        ),
      },
      type: InteractionResponseTypes.Modal,
    };

    return interactionResponse;
  }
}
