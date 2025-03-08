import { createMessage } from "@functions/createMessage.js";
import { KanbanBoardService } from "@services/KanbanBoardService.js";
import { ModalComponent, type ModalComponentRunOptions } from "@structures/components/ModalComponent.js";
import { Declare } from "@util/decorators.js";

@Declare({
  customId: "@kanban_manage_board/title",
})
export default class KanbanBoardTitleComponent extends ModalComponent {
  kanbanBoardService = new KanbanBoardService();

  /**
   * The method to execute when the modal is submited.
   * @param options - The available options.
   */
  async _run(options: ModalComponentRunOptions): Promise<unknown> {
    const { context, t, textInputsResolver, values } = options;
    const [boardIdFromCustomId] = values;
    const { kanbanBoardService } = this;
    const kanbanBoard = await kanbanBoardService.getKanbanBoard(boardIdFromCustomId);

    if (!kanbanBoard) {
      return await createMessage(context, t("categories.utility.kanban.board.manage.kanban_board_not_found"));
    }

    const { user } = context;
    const { id: userId } = user;
    const userCanManageKanbanBoard = kanbanBoardService.checkKanbanBoardUserPermissions(kanbanBoard, userId);

    if (!userCanManageKanbanBoard) {
      return await createMessage(context, t("categories.utility.kanban.board.manage.user_cannot_manage_kanban_board"));
    }

    const { boardId } = kanbanBoard;
    const boardTitle = textInputsResolver.getTextInputValue("@kanban_manage_board/title", true);

    await kanbanBoardService.updateKanbanBoard(boardId, {
      boardTitle,
    });

    return await createMessage(
      context,
      t("categories.utility.kanban.board.manage.message_1.components.buttons.board_title.message_1"),
    );
  }
}
