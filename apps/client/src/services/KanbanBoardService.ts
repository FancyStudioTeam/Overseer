import type { BigString } from "@discordeno/bot";
import type { Prisma, UserKanbanBoard } from "@prisma/client";
import { prisma } from "@util/prisma.js";
import type { MaybeNullish } from "@util/types.js";

export class KanbanBoardService {
  /**
   * Checks whether the user has permissions to manage the Kanban board.
   * @param kanbanBoard - The Kanban board object.
   * @param userIdBigString - The user id as BigString.
   * @returns Whether the user has permissions to manage the Kanban board.
   */
  checkKanbanBoardUserPermissions(kanbanBoard: KanbanBoard, userIdBigString: BigString): boolean {
    const userId = userIdBigString.toString();
    const { administratorIds, ownerId } = kanbanBoard;

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
  async getKanbanBoard(boardId: string): Promise<MaybeNullish<KanbanBoard>> {
    const { userKanbanBoard } = prisma;
    const kanbanBoard = await userKanbanBoard.findUnique({
      where: {
        boardId,
      },
    });

    return kanbanBoard;
  }

  /**
   * Updates the Kanban board.
   * @param boardId - The Kanban board id.
   * @param updateQuery - The data to update.
   * @returns The updated Kanban board object.
   */
  async updateKanbanBoard(boardId: string, updateQuery: UpdateKanbanBoard): Promise<KanbanBoard> {
    const { userKanbanBoard } = prisma;
    const updatedKanbanBoard = await userKanbanBoard.update({
      data: updateQuery,
      where: {
        boardId,
      },
    });

    return updatedKanbanBoard;
  }
}

export type KanbanBoard = UserKanbanBoard;
type UpdateKanbanBoard = Prisma.UserKanbanBoardUpdateInput;
