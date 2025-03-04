import { createCanvas } from "@napi-rs/canvas";
import type { Prisma } from "@prisma/client";

export class KanbanBoardService {
  drawKanbanBoard(kanbanBoard: KanbanBoard): Buffer {
    const canvas = createCanvas(1000, 500);
    const context = canvas.getContext("2d");
    const canvasBuffer = canvas.toBuffer("image/png");

    return canvasBuffer;
  }
}

type KanbanBoard = Prisma.UserKanbanBoardGetPayload<true>;
