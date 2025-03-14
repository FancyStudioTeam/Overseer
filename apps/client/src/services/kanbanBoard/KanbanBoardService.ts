import type { BigString } from "@discordeno/bot";
import { Mixin } from "ts-mixer";
import { KanbanBoardDiscordService } from "./KanbanBoardDiscordService.js";
import { type KanbanBoard, KanbanBoardPrismaService } from "./KanbanBoardPrismaService.js";

export class KanbanBoardService extends Mixin(KanbanBoardDiscordService, KanbanBoardPrismaService) {
  /**
   * Checks whether the user has permissions to manage the Kanban board.
   * @param kanbanBoard - The Kanban board object.
   * @param userIdBigString - The user id as BigString.
   * @returns Whether the user has permissions to manage the Kanban board.
   */
  checkKanbanBoardUserPermissions(kanbanBoard: KanbanBoard, userIdBigString: BigString): boolean {
    const userId = userIdBigString.toString();
    const { administratorIds, creatorId } = kanbanBoard;

    if (creatorId === userId) {
      return true;
    }

    if (administratorIds.includes(userId)) {
      return true;
    }

    return false;
  }
}

export type * from "./KanbanBoardDiscordService.js";
export type * from "./KanbanBoardPrismaService.js";
