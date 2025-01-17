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
import { createMessage } from "@functions/client/createMessage.js";
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
    const [apiRequestsLatency, databaseLatency] = await Promise.all([
      this.getApiRequestsLatency(client.rest),
      this.getDatabaseLatency(context.guildId),
    ]);
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
   * Calculates the APi requests latency.
   * @param rest The REST manager.
   * @returns The API requests latency in milliseconds.
   */
  async getApiRequestsLatency(rest: RestManager): Promise<number> {
    const startHrtime = process.hrtime.bigint();

    /**
     * Sends a request to fetch the current user and waits until the promise is resolved or rejected.
     */
    await rest.getCurrentUser(DISCORD_TOKEN);

    const endHrtime = process.hrtime.bigint();
    const executionTime = this.calculateExecutionTime(startHrtime, endHrtime);
    const roundedExecutionTime = Math.round(executionTime);

    return roundedExecutionTime;
  }

  /**
   * Calculates the database latency.
   * @param guildIdBigString The guild ID as a BigString.
   * @returns The database latency in milliseconds.
   */
  async getDatabaseLatency(guildIdBigString?: BigString): Promise<number> {
    const guildId = guildIdBigString?.toString();
    const startHrtime = process.hrtime.bigint();

    /**
     * Sends a query to the database and waits until the promise is resolved or rejected.
     */
    await prisma.guildConfiguration.findUnique({
      where: {
        guildId,
      },
    });

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
