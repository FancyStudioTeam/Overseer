import { createMessage } from "@functions/createMessage.js";
import { editMessage } from "@functions/editMessage.js";
import { KanbanBoardService } from "@services/kanbanBoard/KanbanBoardService.js";
import { ModalComponent, type ModalComponentRunOptions } from "@structures/components/ModalComponent.js";
import { Declare } from "@util/decorators.js";

@Declare({
  customId: "@kanban_board/create_section",
})
export default class KanbanBoardCreateSectionComponent extends ModalComponent {
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
      return await createMessage(context, t("utility.kanban.board.manage.kanban_board_not_found"));
    }

    const { user } = context;
    const { id: userId } = user;
    const userCanManageKanbanBoard = kanbanBoardService.checkKanbanBoardUserPermissions(kanbanBoard, userId);

    if (!userCanManageKanbanBoard) {
      return await createMessage(context, t("utility.kanban.board.manage.user_cannot_manage_kanban_board"));
    }

    const sectionTitle = textInputsResolver.getTextInputValue("title", true);
    const sectionDescription = textInputsResolver.getTextInputValue("description");

    const createdKanbanBoardSection = await kanbanBoardService.createKanbanBoardSection(kanbanBoard, {
      description: sectionDescription,
      title: sectionTitle,
    });
    const { board: updatedKanbanBoard } = createdKanbanBoardSection;
    const messagePayload = kanbanBoardService.getKanbanBoardSectionsPayload(updatedKanbanBoard, t);

    return await editMessage(context, messagePayload);
  }
}
