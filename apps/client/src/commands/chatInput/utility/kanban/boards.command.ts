import type { BigString, Camelize, DiscordEmbed } from "@discordeno/bot";
import { codeBlock } from "@discordjs/formatters";
import { createMessage } from "@functions/createMessage.js";
import { formatAnsiKeyValues } from "@functions/formatAnsiKeyValue.js";
import { formatTimestamp } from "@functions/formatTimestamp.js";
import type { Prisma } from "@prisma/client";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { DEFAULT_EMBED_COLOR } from "@util/constants.js";
import { Declare } from "@util/decorators.js";
import { prisma } from "@util/prisma.js";
import type { User } from "@util/types.js";
import type { TFunction } from "i18next";

@Declare({
  description: "Displays your created and shared Kanban boards.",
  descriptionLocalizations: {
    "es-419": "Muestra tus tableros Kanban creados y compartidos.",
    "es-ES": "Muestra tus tableros Kanban creados y compartidos.",
  },
  name: "boards",
})
export default class KanbanBoardsCommand extends ChatInputSubCommand {
  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async run(options: ChatInputSubCommandRunOptions<unknown>): Promise<void> {
    const { context, t } = options;
    const { user } = context;
    const { id: userId } = user;
    const kanbanBoards = await this.getKanbanBoards(userId);

    if (kanbanBoards.length === 0) {
      // @ts-expect-error
      return await createMessage(context, t("categories.utility.kanban.boards.no_created_or_shared_kanban_boards"));
    }

    const groupedKanbanBoards = this.groupKanbanBoards(kanbanBoards, userId);
    const kanbanBoardsListEmbeds = await this.getKanbanBoardEmbeds(groupedKanbanBoards, {
      t,
      user,
    });

    await createMessage(context, {
      embeds: kanbanBoardsListEmbeds,
    });
  }

  /**
   * Gets an array containing embeds with the Kanban boards list.
   * @param groupedKanbanBoards - The grouped Kanban boards.
   * @param options - The available options.
   * @returns An array containing embeds with the Kanban boards list
   */
  async getKanbanBoardEmbeds(
    groupedKanbanBoards: GroupedKanbanBoards,
    options: GetKanbanBoardsEmbedsList,
  ): Promise<CamelizedDiscordEmbed[]> {
    const { t, user } = options;
    const { ownedKanbanBoards, sharedKanbanBoards } = groupedKanbanBoards;
    const kanbanBoardEmbeds: CamelizedDiscordEmbed[] = [];

    if (ownedKanbanBoards && ownedKanbanBoards.length > 0) {
      const authorTranslation = t("categories.utility.kanban.boards.message_1.embed_1.author");
      const createdEmbedList = await this.createKanbanBoardsEmbed(ownedKanbanBoards, {
        authorTranslation,
        t,
        user,
      });

      kanbanBoardEmbeds.push(createdEmbedList);
    }

    if (sharedKanbanBoards && sharedKanbanBoards.length > 0) {
      const authorTranslation = t("categories.utility.kanban.boards.message_1.embed_2.author");
      const createdEmbedList = await this.createKanbanBoardsEmbed(sharedKanbanBoards, {
        authorTranslation,
        t,
        user,
      });

      kanbanBoardEmbeds.push(createdEmbedList);
    }

    return kanbanBoardEmbeds;
  }

  /**
   * Creates an embed object containing the Kanban boards list.
   * @param kanbanBoards - The Kanban boards.
   * @param options - The available options.
   * @returns An embed object containing the Kanban boards list.
   */
  async createKanbanBoardsEmbed(
    kanbanBoards: KanbanBoard[],
    options: CreateEmbedListOptions,
  ): Promise<CamelizedDiscordEmbed> {
    const { authorTranslation, t, user } = options;
    const formattedKanbanBoards = this.formatKanbanBoards(kanbanBoards, t);
    const userAvatarUrl = await this.getAvatarUrl(user);
    const embedListObject: CamelizedDiscordEmbed = {
      author: {
        iconUrl: userAvatarUrl,
        name: authorTranslation,
      },
      color: DEFAULT_EMBED_COLOR,
      description: codeBlock("ansi", formattedKanbanBoards),
    };

    return embedListObject;
  }

  /**
   * Gets the Kanban boards list separator.
   * @returns The Kanban boards list separator.
   */
  getListSeparator(): string {
    const lines = "-".repeat(50);

    return `\n${lines}\n`;
  }

  /**
   * Formats the Kanban boards list.
   * @param kanbanBoards - The Kanban boards to format.
   * @param t - The function to translate the command messages.
   * @returns The formatted list of the Kanban boards.
   */
  formatKanbanBoards(kanbanBoards: KanbanBoard[], t: TFunction<"commands">): string {
    const formattedKanbanBoards = kanbanBoards.map((kanbanBoard) => {
      const { boardTitle, createdAt } = kanbanBoard;
      const kanbanBoardTranslationItem = t("categories.utility.kanban.boards.message_1.embed_1.description", {
        boardCreatedAt: formatTimestamp(createdAt),
        boardName: boardTitle,
      });
      const formattedKanbanBoard = formatAnsiKeyValues(kanbanBoardTranslationItem);

      return formattedKanbanBoard;
    });

    const listSeparator = this.getListSeparator();

    return formattedKanbanBoards.join(listSeparator);
  }

  /**
   * Gets the created or shared user Kanban boards.
   * @param userIdBigString - The user id as BigString.
   * @returns An array containing the created or shared user Kanban boards.
   */
  async getKanbanBoards(userIdBigString: BigString): Promise<KanbanBoard[]> {
    const userId = userIdBigString.toString();
    const createdKanbanBoards = await prisma.userKanbanBoard.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      where: {
        // biome-ignore lint/style/useNamingConvention: Prisma naming convention.
        OR: [
          {
            ownerId: userId,
          },
          {
            administratorIds: {
              has: userId,
            },
          },
        ],
      },
    });

    return createdKanbanBoards;
  }

  /**
   * Groups an array of Kanban boards by owned or shared Kanban boards.
   * @param kanbanBoards - The array of Kanban boards to group.
   * @param userIdBigString - The user id as BigString.
   * @returns An object containing the owned and shared Kanban boards.
   */
  groupKanbanBoards(kanbanBoards: KanbanBoard[], userIdBigString: BigString): GroupedKanbanBoards {
    const userId = userIdBigString.toString();
    const groupedKanbanBoards = Object.groupBy(kanbanBoards, ({ ownerId }) =>
      ownerId === userId ? "ownedKanbanBoards" : "sharedKanbanBoards",
    );

    return groupedKanbanBoards;
  }
}

type KanbanBoard = Prisma.UserKanbanBoardGetPayload<true>;

type GroupedKanbanBoards = Partial<Record<"ownedKanbanBoards" | "sharedKanbanBoards", KanbanBoard[]>>;

type CamelizedDiscordEmbed = Camelize<DiscordEmbed>;

interface GetKanbanBoardsEmbedsList {
  /** The function to translate the command messages. */
  t: TFunction<"commands">;
  /** The user object to get the avatar url. */
  user: User;
}

interface CreateEmbedListOptions {
  /** The embed author name translation. */
  authorTranslation: string;
  /** The function to translate the command messages. */
  t: TFunction<"commands">;
  /** The user object to get the avatar url. */
  user: User;
}
