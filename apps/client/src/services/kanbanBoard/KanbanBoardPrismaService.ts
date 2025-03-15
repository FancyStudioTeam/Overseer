import type { Prisma } from "@prisma/client";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { prisma } from "@util/prisma.js";
import type { MaybeNullish } from "@util/types.js";

export class KanbanBoardPrismaService {
  /**
   * Counts the number of Kanban board tasks from a Kanban board section.
   * @param sectionId - The Kanban board section id.
   * @returns The number of Kanban board tasks.
   */
  async countKanbanBoardTasks(sectionId: string): Promise<number> {
    const { userKanbanBoardTask } = prisma;
    const kanbanBoardTasksCount = await userKanbanBoardTask.count({
      where: {
        sectionId,
      },
    });

    return kanbanBoardTasksCount;
  }

  /**
   * Counts the number of Kanban board sections from a Kanban board.
   * @param boardId - The Kanban board id.
   * @returns The number of Kanban board sections.
   */
  async countKanbanBoardSections(boardId: string): Promise<number> {
    const { userKanbanBoardSection } = prisma;
    const kanbanBoardSectionsCount = await userKanbanBoardSection.count({
      where: {
        boardId,
      },
    });

    return kanbanBoardSectionsCount;
  }

  /**
   * Creates a new Kanban board.
   * @param createQuery - The data to create.
   * @returns The created Kanban board object.
   */
  async createKanbanBoard(createQuery: CreateKanbanBoardQuery): Promise<KanbanBoard> {
    const { userKanbanBoard } = prisma;
    const boardId = DiscordSnowflake.generate().toString();
    const createdKanbanBoard = await userKanbanBoard.create({
      data: {
        id: boardId,
        ...createQuery,
      },
      include: {
        sections: true,
      },
    });

    return createdKanbanBoard;
  }

  /**
   * Creates a new Kanban board section.
   * @param kanbanBoard - The Kanban board object.
   * @param createQuery - The data to create.
   * @returns The created Kanban board section object.
   */
  async createKanbanBoardSection(
    kanbanBoard: KanbanBoard,
    createQuery: CreateKanbanBoardSectionQuery,
  ): Promise<KanbanBoardSection> {
    const { id: boardId } = kanbanBoard;
    const { userKanbanBoardSection } = prisma;
    const boardSectionId = DiscordSnowflake.generate().toString();
    const boardSectionCount = await this.countKanbanBoardSections(boardId);
    const sectionPosition = boardSectionCount + 1;
    const createdKanbanBoardSection = await userKanbanBoardSection.create({
      data: {
        boardId,
        id: boardSectionId,
        position: sectionPosition,
        ...createQuery,
      },
      include: {
        board: {
          include: {
            sections: true,
          },
        },
      },
    });

    return createdKanbanBoardSection;
  }

  /**
   * Deletes the Kanban board section.
   * @param kanbanBoardSection - The Kanban board section object.
   * @returns The deleted Kanban board section object.
   */
  async deleteKanbanBoardSection(kanbanBoardSection: KanbanBoardSection): Promise<KanbanBoardSection> {
    const { id: sectionId, position: sectionPosition } = kanbanBoardSection;
    const { userKanbanBoardSection } = prisma;
    const [deletedKanbanBoardSection] = await prisma.$transaction([
      userKanbanBoardSection.delete({
        include: {
          board: {
            include: {
              sections: true,
            },
          },
        },
        where: {
          id: sectionId,
        },
      }),
      /** Find all the sections with a greater position than the current one and decrement their position by 1. */
      userKanbanBoardSection.updateMany({
        data: {
          position: {
            decrement: 1,
          },
        },
        where: {
          position: {
            gt: sectionPosition,
          },
        },
      }),
    ]);

    return deletedKanbanBoardSection;
  }

  /**
   * Gets the Kanban board object.
   * @param boardId - The Kanban board id.
   * @returns The Kanban board object.
   */
  async getKanbanBoard(boardId: string): Promise<MaybeNullish<KanbanBoard>> {
    const { userKanbanBoard } = prisma;
    const kanbanBoard = await userKanbanBoard.findUnique({
      include: {
        sections: true,
      },
      where: {
        id: boardId,
      },
    });

    return kanbanBoard;
  }

  /**
   * Gets the Kanban board section object.
   * @param sectionId - The Kanban board section id.
   * @returns The Kanban board section object.
   */
  async getKanbanBoardSection(sectionId: string): Promise<MaybeNullish<KanbanBoardSection>> {
    const { userKanbanBoardSection } = prisma;
    const kanbanBoardSection = await userKanbanBoardSection.findUnique({
      include: {
        board: {
          include: {
            sections: true,
          },
        },
      },
      where: {
        id: sectionId,
      },
    });

    return kanbanBoardSection;
  }

  /**
   * Updates a Kanban board object.
   * @param boardId - The Kanban board id to update.
   * @param updateQuery - The data to update.
   * @returns The updated Kanban board object.
   */
  async updateKanbanBoard(boardId: string, updateQuery: UpdateKanbanBoardQuery): Promise<KanbanBoard> {
    const { userKanbanBoard } = prisma;
    const updatedKanbanBoard = await userKanbanBoard.update({
      data: updateQuery,
      include: {
        sections: true,
      },
      where: {
        id: boardId,
      },
    });

    return updatedKanbanBoard;
  }

  /**
   * Updates a Kanban board section.
   * @param sectionId - The Kanban board section id.
   * @param updateQuery - The data to update.
   * @returns The updated Kanban board section object.
   */
  async updateKanbanBoardSection(
    sectionId: string,
    updateQuery: UpdateKanbanBoardSectionQuery,
  ): Promise<KanbanBoardSection> {
    const { userKanbanBoardSection } = prisma;
    const updatedKanbanBoardSection = await userKanbanBoardSection.update({
      data: updateQuery,
      include: {
        board: {
          include: {
            sections: true,
          },
        },
      },
      where: {
        id: sectionId,
      },
    });

    return updatedKanbanBoardSection;
  }
}

export type KanbanBoard = Prisma.UserKanbanBoardGetPayload<{
  include: {
    sections: true;
  };
}>;
export type KanbanBoardSection = Prisma.UserKanbanBoardSectionGetPayload<{
  include: {
    board: {
      include: {
        sections: true;
      };
    };
  };
}>;

type CreateKanbanBoardQuery = Omit<Prisma.UserKanbanBoardCreateInput, "id" | "sections">;
type CreateKanbanBoardSectionQuery = Omit<Prisma.UserKanbanBoardSectionCreateInput, "board" | "id">;
type UpdateKanbanBoardQuery = Prisma.UserKanbanBoardUpdateInput;
type UpdateKanbanBoardSectionQuery = Prisma.UserKanbanBoardSectionUpdateInput;
