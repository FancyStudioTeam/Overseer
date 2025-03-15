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
    const isOwner = this.userIsOwner(kanbanBoard, userIdBigString);
    const isAdministrator = this.userIsAdministrator(kanbanBoard, userIdBigString);

    return isOwner || isAdministrator;
  }

  /**
   * Checks whether the user is an administrator of the Kanban board.
   * @param kanbanBoard - The Kanban board object.
   * @param userIdBigString - The user id as BigString.
   * @returns Whether the user is an administrator of the Kanban board.
   */
  private userIsAdministrator(kanbanBoard: KanbanBoard, userIdBigString: BigString): boolean {
    const userId = userIdBigString.toString();
    const { administratorIds } = kanbanBoard;

    return administratorIds.includes(userId);
  }

  /**
   * Checks whether the user is the owner of the Kanban board.
   * @param kanbanBoard - The Kanban board object.
   * @param userIdBigString - The user id as BigString.
   * @returns Whether the user is the owner of the Kanban board.
   */
  private userIsOwner(kanbanBoard: KanbanBoard, userIdBigString: BigString): boolean {
    const userId = userIdBigString.toString();
    const { creatorId } = kanbanBoard;

    return creatorId === userId;
  }
}

export type * from "./KanbanBoardDiscordService.js";
export type * from "./KanbanBoardPrismaService.js";
