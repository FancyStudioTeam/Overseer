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
    return;
    /*const { context, t, values } = options;
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

    const { boardTitleComponent } = this.getRequiredTextInputs(textInputs);
    const { value: boardTitle } = boardTitleComponent;

    await kanbanBoardService.updateKanbanBoard(boardIdFromCustomId, {
      boardTitle,
    });

    return;
  }

  getRequiredTextInputs(textInputs: TextInputComponent[]): RequiredTextInputComponents {
    const boardTitleTextInput = textInputs.find(({ customId }) => customId === "@kanban_manage_board/title");

    if (!boardTitleTextInput) {
      throw new Error("Cannot find the board title text input component.");
    }

    return {
      boardTitleComponent: boardTitleTextInput,
    };
  }*/
  }
}
