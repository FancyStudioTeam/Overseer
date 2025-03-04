import { ApplicationCommandOptionTypes, type BigString, ButtonStyles, MessageComponentTypes } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { parseEmoji } from "@functions/parseEmoji.js";
import type { Prisma } from "@prisma/client";
import { KanbanBoardService } from "@services/KanbanBoardService.js";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { DEFAULT_EMBED_COLOR } from "@util/constants.js";
import { Declare } from "@util/decorators.js";
import { prisma } from "@util/prisma.js";
import type { MaybeNullable } from "@util/types.js";

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
    const kanbanBoard = await this.getKanbanBoard(boardId);

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
    const userCanManageKanbanBoard = this.checkKanbanBoardUserPermissions(kanbanBoard, userId);

    if (!userCanManageKanbanBoard) {
      return await createMessage(context, t("categories.utility.kanban.board.manage.user_cannot_manage_kanban_board"));
    }

    const { kanbanBoardService } = this;
    const kanbanBoardImageBuffer = kanbanBoardService.drawKanbanBoard(kanbanBoard);
    const kanbanBoardImageBlob = new Blob([kanbanBoardImageBuffer], {
      type: "image/png",
    });

    return await createMessage(context, {
      components: [
        {
          components: [
            {
              customId: `@kanban_manage_board/title#[${boardId}]`,
              emoji: parseEmoji("TITLE"),
              label: t("categories.utility.kanban.board.manage.message_1.components.buttons.board_title.label"),
              style: ButtonStyles.Secondary,
              type: MessageComponentTypes.Button,
            },
            {
              customId: `@kanban_manage_board/user_permissions#[${boardId}]`,
              emoji: parseEmoji("GROUP"),
              label: t("categories.utility.kanban.board.manage.message_1.components.buttons.user_permissions.label"),
              style: ButtonStyles.Secondary,
              type: MessageComponentTypes.Button,
            },
            {
              customId: `@kanban_manage_board/delete_board#[${boardId}]`,
              emoji: parseEmoji("TRASH_COLORED"),
              label: t("categories.utility.kanban.board.manage.message_1.components.buttons.delete_board.label"),
              style: ButtonStyles.Danger,
              type: MessageComponentTypes.Button,
            },
          ],
          type: MessageComponentTypes.ActionRow,
        },
      ],
      embeds: [
        {
          color: DEFAULT_EMBED_COLOR,
          image: {
            url: "attachment://kanban_board.png",
          },
        },
      ],
      files: [
        {
          blob: kanbanBoardImageBlob,
          name: "kanban_board.png",
        },
      ],
    });
  }

  /**
   * Checks whether the user has permissions to manage the Kanban board.
   * @param kanbanBoard - The Kanban board object.
   * @param userIdBigString - The user id as BigString.
   * @returns Whether the user has permissions to manage the Kanban board.
   */
  checkKanbanBoardUserPermissions(kanbanBoard: KanbanBoard, userIdBigString: BigString): boolean {
    const { administratorIds, ownerId } = kanbanBoard;
    const userId = userIdBigString.toString();

    if (ownerId === userId) {
      return true;
    }

    if (administratorIds.includes(userId)) {
      return true;
    }

    return false;
  }

  /**
   * Gets the Kanban board object.
   * @param boardId - The Kanban board id.
   * @returns The Kanban board object.
   */
  async getKanbanBoard(boardId: string): Promise<MaybeNullable<KanbanBoard>> {
    const { userKanbanBoard } = prisma;
    const kanbanBoard = await userKanbanBoard.findFirst({
      where: {
        boardId,
      },
    });

    return kanbanBoard;
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

type KanbanBoard = Prisma.UserKanbanBoardGetPayload<true>;
