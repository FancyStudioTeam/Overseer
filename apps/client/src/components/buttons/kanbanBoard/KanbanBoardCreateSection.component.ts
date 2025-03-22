import { type InteractionResponse, InteractionResponseTypes, MessageComponentTypes, TextStyles } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { type KanbanBoard, KanbanBoardService } from "@services/kanbanBoard/KanbanBoardService.js";
import { ButtonComponent, type ButtonComponentRunOptions } from "@structures/components/ButtonComponent.js";
import { client } from "@util/client.js";
import { Declare } from "@util/decorators.js";
import type { TFunction } from "i18next";

@Declare({
  customId: "@kanban_board/create_section",
})
export default class KanbanBoardCreateSectionComponent extends ButtonComponent {
  kanbanBoardService = new KanbanBoardService();

  /**
   * The method to execute when the button is pressed.
   * @param options - The available options.
   */
  async _run(options: ButtonComponentRunOptions): Promise<unknown> {
    const { context, t, values } = options;
    const [boardIdFromCustomId] = values;
    const { kanbanBoardService } = this;
    const kanbanBoard = await kanbanBoardService.getKanbanBoard(boardIdFromCustomId);

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
    const modalInteractionResponse = this.getModalInteractionResponse(kanbanBoard, t);

    return await helpers.sendInteractionResponse(id, token, modalInteractionResponse);
  }

  /**
   * Gets the modal interaction response object.
   * @param kanbanBoard - The Kanban board object.
   * @param t - The function to translate the command messages.
   * @returns An object containing the modal interaction response.
   */
  getModalInteractionResponse(kanbanBoard: KanbanBoard, t: TFunction<"commands">): InteractionResponse {
    const { id: boardId } = kanbanBoard;
    const interactionResponse: InteractionResponse = {
      data: {
        components: [
          {
            components: [
              {
                customId: "title",
                label: t(
                  "utility.kanban.board.manage.components.manage_sections_button.components.create_section_button.components.create_section_modal.section_name_input.label",
                ),
                maxLength: 35,
                minLength: 3,
                required: true,
                style: TextStyles.Short,
                type: MessageComponentTypes.InputText,
              },
            ],
            type: MessageComponentTypes.ActionRow,
          },
          {
            components: [
              {
                customId: "description",
                label: t(
                  "utility.kanban.board.manage.components.manage_sections_button.components.create_section_button.components.create_section_modal.section_description_input.label",
                ),
                maxLength: 150,
                required: false,
                style: TextStyles.Paragraph,
                type: MessageComponentTypes.InputText,
              },
            ],
            type: MessageComponentTypes.ActionRow,
          },
        ],
        customId: `@kanban_board/create_section#[${boardId}]`,
        title: t(
          "utility.kanban.board.manage.components.manage_sections_button.components.create_section_button.components.create_section_modal.title",
        ),
      },
      type: InteractionResponseTypes.Modal,
    };

    return interactionResponse;
  }
}
