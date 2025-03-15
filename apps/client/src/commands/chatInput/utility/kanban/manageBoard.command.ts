import { ApplicationCommandOptionTypes } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { KanbanBoardService } from "@services/kanbanBoard/KanbanBoardService.js";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { Declare } from "@util/decorators.js";

@Declare({
  description: "Manages a Kanban board.",
  descriptionLocalizations: {
    "es-419": "Gestiona un tablero Kanban.",
    "es-ES": "Gestiona un tablero Kanban.",
  },
  name: "manage_board",
  options: [
    {
      autocomplete: true,
      description: "The Kanban board id to manage.",
      descriptionLocalizations: {
        "es-419": "El id del tablero Kanban a gestionar.",
        "es-ES": "El id del tablero Kanban a gestionar.",
      },
      name: "board_id",
      required: true,
      type: ApplicationCommandOptionTypes.String,
    },
  ],
})
export default class KanbanManageBoardCommand extends ChatInputSubCommand {
  kanbanBoardService = new KanbanBoardService();

  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async _run(options: ChatInputSubCommandRunOptions<Options>): Promise<unknown> {
    const { context, options: commandOptions, t } = options;
    const { kanban } = commandOptions;
    const { manage_board: manageBoard } = kanban;
    const { board_id: boardId } = manageBoard;
    const { kanbanBoardService } = this;
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

    const messagePayload = kanbanBoardService.getKanbanBoardInformationPayload(kanbanBoard, t);

    return await createMessage(context, messagePayload, {
      isEphemeral: false,
    });
  }
}

interface Options {
  kanban: {
    // biome-ignore lint/style/useNamingConvention: Discordeno handles properties as they are registered in the application commands.
    manage_board: {
      // biome-ignore lint/style/useNamingConvention: Discordeno handles properties as they are registered in the application commands.
      board_id: string;
    };
  };
}
