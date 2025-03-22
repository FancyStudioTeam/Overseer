import { createMessage } from "@functions/createMessage.js";
import { editMessage } from "@functions/editMessage.js";
import { KanbanBoardService } from "@services/kanbanBoard/KanbanBoardService.js";
import { SelectMenuComponent, type SelectMenuComponentRunOptions } from "@structures/components/SelectMenuComponent.js";
import { Declare } from "@util/decorators.js";

@Declare({
  customId: "@kanban_board/manage_section",
})
export default class KanbanBoardManageSectionComponent extends SelectMenuComponent {
  kanbanBoardService = new KanbanBoardService();

  /**
   * The method to execute when a select menu option is selected.
   * @param options - The available options.
   */
  async _run(options: SelectMenuComponentRunOptions): Promise<unknown> {
    const { context, optionsResolver, t, values } = options;
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

    const [kanbanBoardSectionId] = optionsResolver.getStrings();
    const kanbanBoardSection = await kanbanBoardService.getKanbanBoardSection(kanbanBoardSectionId);

    if (!kanbanBoardSection) {
      return await createMessage(
        context,
        t("utility.kanban.board.manage.components.manage_sections_button.kanban_board_section_not_found"),
      );
    }

    const messagePayload = kanbanBoardService.getKanbanBoardSectionInformationPayload(kanbanBoardSection, t);

    return await editMessage(context, messagePayload);
  }
}
