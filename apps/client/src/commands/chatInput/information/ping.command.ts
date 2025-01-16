import { DISCORD_TOKEN } from "@config";
import { ApplicationCommandOptionTypes, type BigString, type EmbedField, bold, magenta } from "@discordeno/bot";
import { codeBlock } from "@discordjs/formatters";
import { createMessage } from "@functions/client/createMessage.js";
import type { Client } from "@index";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@util/handlers.js";
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
    const [restLatency, databaseLatency] = await Promise.all([
      this.getRestLatency(client),
      this.getDatabaseLatency(context.guildId),
    ]);
    const [restLatencyField, databaseLatencyField]: EmbedField[] = [
      {
        inline: true,
        name: t("commands.categories.information.ping.message_1.embed.field_1.name"),
        value: codeBlock("ansi", bold(magenta(restLatency))),
      },
      {
        inline: true,
        name: t("commands.categories.information.ping.message_1.embed.field_2.name"),
        value: codeBlock("ansi", bold(magenta(databaseLatency))),
      },
    ];

    await createMessage(context, {
      fields: [restLatencyField, databaseLatencyField],
    });
  }

  /**
   * Calculates the REST latency.
   * @param client The client instance.
   * @returns The formatted REST latency.
   */
  async getRestLatency(client: Client): Promise<string> {
    const startWatcherTime = process.hrtime.bigint();

    /**
     * Sends a request to fetch the current user and waits until the promise is resolved or rejected.
     */
    await client.rest.getCurrentUser(DISCORD_TOKEN);

    const endWatcherTime = process.hrtime.bigint();
    const executionTime = this.calculateExecutionTime(startWatcherTime, endWatcherTime);

    return `${(executionTime).toFixed(0)}ms`;
  }

  /**
   * Calculates the database latency.
   * @param guildIdBigString The guild ID as a BigString.
   * @returns The formatted database latency.
   */
  async getDatabaseLatency(guildIdBigString?: BigString): Promise<string> {
    const guildId = guildIdBigString?.toString();
    const startWatcherTime = process.hrtime.bigint();

    /**
     * Sends a query to the database and waits until the promise is resolved or rejected.
     */
    await prisma.guildConfiguration.findUnique({
      where: {
        guildId,
      },
    });

    const endWatcherTime = process.hrtime.bigint();
    const executionTime = this.calculateExecutionTime(startWatcherTime, endWatcherTime);

    return `${(executionTime).toFixed(0)}ms`;
  }

  /**
   * Calculates the execution time.
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
