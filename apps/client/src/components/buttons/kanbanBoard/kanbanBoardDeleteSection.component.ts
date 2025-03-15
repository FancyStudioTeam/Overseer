import { createMessage } from "@functions/createMessage.js";
import { editMessage } from "@functions/editMessage.js";
import { KanbanBoardService } from "@services/kanbanBoard/KanbanBoardService.js";
import { ButtonComponent, type ButtonComponentRunOptions } from "@structures/components/ButtonComponent.js";
import { Declare } from "@util/decorators.js";

@Declare({
  customId: "@kanban_board/delete_section",
})
export default class KanbanBoardDeleteSectionComponent extends ButtonComponent {
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
        t("utility.kanban.board.manage.components.manage_sections_button.kanban_board_section_not_found"),
      );
    }

    const { board } = kanbanBoardSection;
    const { id: boardId } = board;
    const kanbanBoard = await kanbanBoardService.getKanbanBoard(boardId);

    if (!kanbanBoard) {
      return await createMessage(context, t("utility.kanban.board.manage.kanban_board_not_found"));
    }

    const { user } = context;
    const { id: userId } = user;
    const userCanManageKanbanBoard = kanbanBoardService.checkKanbanBoardUserPermissions(kanbanBoard, userId);

    if (!userCanManageKanbanBoard) {
      return await createMessage(context, t("utility.kanban.board.manage.user_cannot_manage_kanban_board"));
    }

    await kanbanBoardService.deleteKanbanBoardSection(kanbanBoardSection);

    const messagePayload = kanbanBoardService.getKanbanBoardInformationPayload(kanbanBoard, t);

    return await editMessage(context, messagePayload);
  }
}
