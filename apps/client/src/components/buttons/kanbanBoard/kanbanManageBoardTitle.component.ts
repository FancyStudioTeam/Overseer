import { type InteractionResponse, InteractionResponseTypes, MessageComponentTypes, TextStyles } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { type KanbanBoard, KanbanBoardService } from "@services/KanbanBoardService.js";
import { ButtonComponent, type ButtonComponentRunOptions } from "@structures/components/ButtonComponent.js";
import { Declare } from "@util/decorators.js";
import type { TFunction } from "i18next";

@Declare({
  customId: "@kanban_manage_board/title",
})
export default class KanbanBoardTitleComponent extends ButtonComponent {
  kanbanBoardService = new KanbanBoardService();

  /**
   * The method to execute when the button is pressed.
   * @param options - The available options.
   */
  async _run(options: ButtonComponentRunOptions): Promise<unknown> {
    const { client, context, t, values } = options;
    const { id, token } = context;
    const [boardIdFromCustomId] = values;
    const { kanbanBoardService } = this;
    const kanbanBoard = await kanbanBoardService.getKanbanBoard(boardIdFromCustomId);

    if (!kanbanBoard) {
      return await createMessage(context, t("categories.utility.kanban.board.manage.kanban_board_not_found"));
    }

    const { helpers } = client;
    const interactionResponse = this.getModalInteractionResponse(kanbanBoard, t);

    await helpers.sendInteractionResponse(id, token, interactionResponse);
  }

  /**
   * Gets the modal interaction response object.
   * @param t - The function to translate the command messages.
   * @param boardId - The Kanban board id.
   * @returns An object containing the modal interaction response.
   */
  getModalInteractionResponse(kanbanBoard: KanbanBoard, t: TFunction<"commands">): InteractionResponse {
    const { boardId, boardTitle } = kanbanBoard;
    const interactionResponse: InteractionResponse = {
      data: {
        components: [
          {
            components: [
              {
                customId: "@kanban_manage_board/title",
                label: t(
                  "categories.utility.kanban.board.manage.message_1.components.buttons.board_title.components.modals.update_board_title.field_1.name",
                ),
                maxLength: 35,
                minLength: 3,
                required: true,
                style: TextStyles.Short,
                type: MessageComponentTypes.InputText,
                value: boardTitle,
              },
            ],
            type: MessageComponentTypes.ActionRow,
          },
        ],
        customId: `@kanban_manage_board/title#[${boardId}]`,
        title: t(
          "categories.utility.kanban.board.manage.message_1.components.buttons.board_title.components.modals.update_board_title.title",
        ),
      },
      type: InteractionResponseTypes.Modal,
    };

    return interactionResponse;
  }
}
