import { type BigString, type EmbedField, type RestManager, bold, magenta } from "@discordeno/bot";
import { codeBlock } from "@discordjs/formatters";
import { createMessage } from "@functions/createMessage.js";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { DISCORD_TOKEN } from "@util/config.js";
import { Declare } from "@util/decorators.js";
import { prisma } from "@util/prisma.js";

@Declare({
  description: "Displays bot latency.",
  descriptionLocalizations: {
    "es-419": "Muestra la latencia del bot.",
    "es-ES": "Muestra la latencia del bot.",
  },
  name: "ping",
})
export default class PingCommand extends ChatInputSubCommand {
  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async _run(options: ChatInputSubCommandRunOptions<never>): Promise<void> {
    const { client, context, t } = options;
    const { guildId } = context;
    const { rest } = client;
    const { apiRequests: apiRequestsLatency, database: databaseLatency } = await this.getLatencies({
      guildIdBigString: guildId,
      rest,
    });
    const [apiRequestsLatencyField, databaseLatencyField]: EmbedField[] = [
      {
        inline: true,
        name: t("categories.information.ping.message_1.embeds.embed_1.field_1.name"),
        value: codeBlock("ansi", bold(magenta(`${apiRequestsLatency} ms`))),
      },
      {
        inline: true,
        name: t("categories.information.ping.message_1.embeds.embed_1.field_2.name"),
        value: codeBlock("ansi", bold(magenta(`${databaseLatency} ms`))),
      },
    ];

    await createMessage(context, {
      fields: [apiRequestsLatencyField, databaseLatencyField],
    });
  }

  /**
   * Calculates the execution time.
   * @param startTime - The start time of the execution.
   * @param endTime - The end time of the execution.
   * @returns The execution time in milliseconds.
   */
  calculateExecutionTime(startTime: bigint, endTime: bigint): number {
    const nanoseconds = Number(endTime - startTime);
    const milliseconds = nanoseconds / 1_000_000;

    return milliseconds;
  }

  /**
   * Gets the execution time of a promise.
   * @param promise - The promise to execute.
   * @returns The promise execution time in milliseconds.
   */
  async getExecutionTime(promise: GetExecutionTimePromise): Promise<number> {
    const { hrtime } = process;
    const startHrtime = hrtime.bigint();

    /** Execute the promise and wait until it is resolved or rejected.  */
    await promise();

    const endHrtime = hrtime.bigint();
    const executionTime = this.calculateExecutionTime(startHrtime, endHrtime);
    const roundedExecutionTime = Math.round(executionTime);

    return roundedExecutionTime;
  }

  /**
   * Gets the API requests and database latencies.
   * @param options - The available options.
   * @returns An object containing the API requests and database latencies.
   */
  async getLatencies(options: GetLatenciesOptions): Promise<Latencies> {
    const { guildIdBigString, rest } = options;
    const guildId = guildIdBigString?.toString();
    const apiRequestPromise = () => rest.getCurrentUser(DISCORD_TOKEN);
    const databasePromise = () =>
      prisma.guildPreferences.findUnique({
        select: {
          guildId: true,
        },
        where: {
          guildId,
        },
      });
    /** Execute all the promises in parallel. */
    const [apiRequestsLatency, databaseLatency] = await Promise.all([
      this.getExecutionTime(apiRequestPromise),
      this.getExecutionTime(databasePromise),
    ]);

    return {
      apiRequests: apiRequestsLatency,
      database: databaseLatency,
    };
  }
}

interface GetLatenciesOptions {
  /** The guild id as BigString. */
  guildIdBigString?: BigString;
  /** The client REST manager. */
  rest: RestManager;
}

interface Latencies {
  /** The API requests latency. */
  apiRequests: number;
  /** The database latency. */
  database: number;
}

type GetExecutionTimePromise = (...args: unknown[]) => Promise<unknown>;
