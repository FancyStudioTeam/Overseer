import { ApplicationCommandOptionTypes, ButtonStyles, MessageComponentTypes } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { parseEmoji } from "@functions/parseEmoji.js";
import { KanbanBoardService } from "@services/KanbanBoardService.js";
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
      return await createMessage(
        context,
        t("categories.utility.kanban.board.manage.kanban_board_not_found", {
          boardId,
        }),
      );
    }

    const { user } = context;
    const { id: userId } = user;
    const userCanManageKanbanBoard = kanbanBoardService.checkKanbanBoardUserPermissions(kanbanBoard, userId);

    if (!userCanManageKanbanBoard) {
      return await createMessage(context, t("categories.utility.kanban.board.manage.user_cannot_manage_kanban_board"));
    }

    return await createMessage(context, {
      components: [
        {
          components: [
            {
              customId: `@kanban_board/title#[${boardId}]`,
              emoji: parseEmoji("TITLE"),
              label: t("categories.utility.kanban.board.manage.message_1.components.buttons.board_title.label"),
              style: ButtonStyles.Secondary,
              type: MessageComponentTypes.Button,
            },
            {
              customId: `@kanban_board/manage_sections#[${boardId}]`,
              emoji: parseEmoji("DEVELOPER_BOARD"),
              label: t("categories.utility.kanban.board.manage.message_1.components.buttons.manage_sections.label"),
              style: ButtonStyles.Secondary,
              type: MessageComponentTypes.Button,
            },
            {
              customId: `@kanban_board/manage_administrators#[${boardId}]`,
              emoji: parseEmoji("GROUP"),
              label: t(
                "categories.utility.kanban.board.manage.message_1.components.buttons.manage_administrators.label",
              ),
              style: ButtonStyles.Secondary,
              type: MessageComponentTypes.Button,
            },
            {
              customId: `@kanban_board/delete_board#[${boardId}]`,
              emoji: parseEmoji("TRASH_COLORED"),
              label: t("categories.utility.kanban.board.manage.message_1.components.buttons.delete_board.label"),
              style: ButtonStyles.Danger,
              type: MessageComponentTypes.Button,
            },
          ],
          type: MessageComponentTypes.ActionRow,
        },
      ],
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
