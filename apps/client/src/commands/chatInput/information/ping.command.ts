import { DISCORD_TOKEN } from "@config";
import {
  ApplicationCommandOptionTypes,
  type BigString,
  type EmbedField,
  type RestManager,
  bold,
  magenta,
} from "@discordeno/bot";
import { codeBlock } from "@discordjs/formatters";
import { createMessage } from "@functions/createMessage.js";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import type { MaybeAwaitable } from "@types";
import { prisma } from "@util/prisma.js";

export default class PingCommand extends ChatInputSubCommand {
  constructor() {
    super({
      description: "Displays bot latency.",
      name: "ping",
      type: ApplicationCommandOptionTypes.SubCommand,
    });
  }

  async run({ client, context, t }: ChatInputSubCommandRunOptions): Promise<void> {
    const { rest } = client;
    const { apiRequests: apiRequestsLatency, database: databaseLatency } = await this.getLatencies({
      guildIdBigString: context.guildId,
      rest,
    });
    const [apiRequestsLatencyField, databaseLatencyField]: EmbedField[] = [
      {
        inline: true,
        name: t("commands.categories.information.ping.message_1.embed.field_1.name"),
        value: codeBlock("ansi", bold(magenta(`${apiRequestsLatency} ms`))),
      },
      {
        inline: true,
        name: t("commands.categories.information.ping.message_1.embed.field_2.name"),
        value: codeBlock("ansi", bold(magenta(`${databaseLatency} ms`))),
      },
    ];

    await createMessage(context, {
      fields: [apiRequestsLatencyField, databaseLatencyField],
    });
  }

  /**
   * Gets the API requests and database latencies.
   * @param options The available options.
   * @returns The API requests and database latencies.
   */
  async getLatencies(options: GetLatenciesOptions): Promise<Latencies> {
    const { guildIdBigString, rest } = options;
    const apiRequestPromise = () => rest.getCurrentUser(DISCORD_TOKEN);
    const databasePromise = () =>
      prisma.guildConfiguration.findUnique({
        select: {
          guildId: true,
        },
        where: {
          guildId: guildIdBigString?.toString(),
        },
      });
    /**
     * Executes all promises in parallel and waits until all promises are resolved or rejected.
     */
    const [apiRequestsLatency, databaseLatency] = await Promise.all([
      this.getExecutionTime(apiRequestPromise),
      this.getExecutionTime(databasePromise),
    ]);

    return {
      apiRequests: apiRequestsLatency,
      database: databaseLatency,
    };
  }

  /**
   * Gets the execution time of a promise.
   * @param promise The promise to execute.
   * @returns The promise execution time in milliseconds.
   */
  async getExecutionTime(promise: GetExecutionTimePromise): Promise<number> {
    const startHrtime = process.hrtime.bigint();

    /**
     * Executes the promise and waits until the promise is resolved or rejected.
     */
    await promise();

    const endHrtime = process.hrtime.bigint();
    const executionTime = this.calculateExecutionTime(startHrtime, endHrtime);
    const roundedExecutionTime = Math.round(executionTime);

    return roundedExecutionTime;
  }

  /**
   * Calculates the execution time of a code.
   * @param startTime The start time of the execution.
   * @param endTime The end time of the execution.
   * @returns The execution time in milliseconds.
   */
  calculateExecutionTime(startTime: bigint, endTime: bigint): number {
    const nanoseconds = Number(endTime - startTime);
    const milliseconds = nanoseconds / 1e6; /* 1_000_000 */

    return milliseconds;
  }
}

interface GetLatenciesOptions {
  /**
   * The guild ID as a BigString.
   */
  guildIdBigString?: BigString;
  /**
   * The REST manager.
   */
  rest: RestManager;
}

interface Latencies {
  /**
   * The API requests latency in milliseconds.
   */
  apiRequests: number;
  /**
   * The database latency in milliseconds.
   */
  database: number;
}

type GetExecutionTimePromise = (...args: unknown[]) => MaybeAwaitable<unknown>;
