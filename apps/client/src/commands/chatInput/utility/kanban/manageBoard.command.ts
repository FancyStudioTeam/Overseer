import { ApplicationCommandOptionTypes, type BigString, ButtonStyles, MessageComponentTypes } from "@discordeno/bot";
import { createMessage } from "@functions/createMessage.js";
import { parseEmoji } from "@functions/parseEmoji.js";
import type { Prisma } from "@prisma/client";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
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
  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async run(options: ChatInputSubCommandRunOptions<Options>): Promise<void> {
    const { context, options: commandOptions, t } = options;
    const { kanban } = commandOptions;
    const { manage_board: manageBoard } = kanban;
    const { board_id: boardId } = manageBoard;
    const { user } = context;
    const { id: userId } = user;
    const kanbanBoard = await this.getKanbanBoard(boardId, userId);

    if (!kanbanBoard) {
      // @ts-expect-error
      return await createMessage(context, t("categories.utility.kanban.manage.kanban_board_not_found"));
    }

    await createMessage(context, {
      components: [
        {
          components: [
            {
              customId: "@kanban_manage_board/title",
              emoji: parseEmoji("TITLE"),
              label: t("categories.utility.kanban.board.manage.message_1.components.buttons.board_title.label"),
              style: ButtonStyles.Secondary,
              type: MessageComponentTypes.Button,
            },
          ],
          type: MessageComponentTypes.ActionRow,
        },
      ],
    });
  }

  async getKanbanBoard(boardId: string, userIdBigString: BigString): Promise<MaybeNullable<KanbanBoard>> {
    const userId = userIdBigString.toString();
    const { userKanbanBoard } = prisma;
    const kanbanBoard = await userKanbanBoard.findFirst({
      where: {
        // biome-ignore lint/style/useNamingConvention: Prisma naming convention.
        OR: [
          {
            boardId,
            ownerId: userId,
          },
          {
            administratorIds: {
              has: userId,
            },
            boardId,
          },
        ],
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
