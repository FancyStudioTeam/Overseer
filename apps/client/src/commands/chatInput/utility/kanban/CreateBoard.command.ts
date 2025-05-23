import { ApplicationCommandOptionTypes, type BigString } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import type { Prisma } from "@prisma/client";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { KanbanBoardService } from "@services/kanbanBoard/KanbanBoardService.js";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { Declare } from "@util/decorators.js";
import { prisma } from "@util/prisma.js";

const MAXIMUM_KANBAN_BOARDS_PER_USER = 10;

@Declare({
  description: "Creates a new Kanban board.",
  name: "create_board",
  options: [
    {
      description: "The name of your Kanban board.",
      descriptionLocalizations: {
        "es-419": "El nombre de tu tablero Kanban.",
        "es-ES": "El nombre de tu tablero Kanban.",
      },
      maxLength: 35,
      minLength: 3,
      name: "board_name",
      required: true,
      type: ApplicationCommandOptionTypes.String,
    },
  ],
})
export default class KanbanCreateBoardCommand extends ChatInputSubCommand {
  kanbanBoardService = new KanbanBoardService();

  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async _run(options: ChatInputSubCommandRunOptions<Options>): Promise<unknown> {
    const { context, options: commandOptions, t } = options;
    const { user } = context;
    const { id: userIdBigInt } = user;
    const ownedKanbanBoards = await this.getOwnedKanbanBoards(userIdBigInt);

    if (ownedKanbanBoards.length >= MAXIMUM_KANBAN_BOARDS_PER_USER) {
      return await createMessage(
        context,
        t("utility.kanban.board.create.user_reached_maximum_kanban_boards", {
          maximum: MAXIMUM_KANBAN_BOARDS_PER_USER,
        }),
      );
    }

    const { kanban } = commandOptions;
    const { create_board: createBoard } = kanban;
    const { board_name: boardName } = createBoard;
    const { kanbanBoardService } = this;
    const userId = userIdBigInt.toString();
    const createdKanbanBoard = await kanbanBoardService.createKanbanBoard({
      creatorId: userId,
      title: boardName,
    });
    const { title: boardTitle } = createdKanbanBoard;

    return await createMessage(
      context,
      t("utility.kanban.board.create.message_1", {
        boardTitle,
      }),
      {
        isEphemeral: false,
      },
    );
  }

  /**
   * Creates a new Kanban board.
   * @param boardTitle - The board title to use.
   * @param userIdBigString - The user id as BigString.
   * @returns An object containing the created Kanban board.
   */
  async createKanbanBoard(boardTitle: string, userIdBigString: BigString): Promise<KanbanBoard> {
    const userId = userIdBigString.toString();
    const boardId = DiscordSnowflake.generate().toString();
    const createdKanbanBoard = await prisma.userKanbanBoard.create({
      data: {
        creatorId: userId,
        id: boardId,
        title: boardTitle,
      },
    });

    return createdKanbanBoard;
  }

  /**
   * Gets the owned Kanban boards.
   * @param userIdBigString - The user id as BigString.
   * @returns An array containing the owned Kanban board objects.
   */
  async getOwnedKanbanBoards(userIdBigString: BigString): Promise<KanbanBoard[]> {
    const userId = userIdBigString.toString();
    const { userKanbanBoard } = prisma;
    const ownedKanbanBoards = await userKanbanBoard.findMany({
      where: {
        creatorId: userId,
      },
    });

    return ownedKanbanBoards;
  }
}

interface Options {
  kanban: {
    // biome-ignore lint/style/useNamingConvention: Discordeno handles properties as they are registered in the application commands.
    create_board: {
      // biome-ignore lint/style/useNamingConvention: Discordeno handles properties as they are registered in the application commands.
      board_name: string;
    };
  };
}

type KanbanBoard = Prisma.UserKanbanBoardGetPayload<true>;
