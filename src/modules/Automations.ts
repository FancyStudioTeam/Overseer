import { client } from "@index";
import type { AnyTextableGuildChannel, Message } from "oceanic.js";
import { ungzip } from "pako";
import { type Sequence, SequenceType, type YAMLCordConditional, type YAMLCordFunction, YAMLCordParser } from "yamlcord";
import { executeConditional } from "./automations/conditionals/executeConditional.js";
import { executeFunction } from "./automations/functions/executeFunction.js";

// biome-ignore lint/suspicious/noExplicitAny:
export const VARIABLES_MAP: Record<string, (...args: any) => string | number> = {
  "[date_now]": () => Date.now(),
  "[guild_id]": (message: MessageInCachedGuild) => message.guildID,
  "[guild_name]": (message: MessageInCachedGuild) => message.guild.name,
  "[message_content]": (message: MessageInCachedGuild) => message.guild.name,
  "[owner_id]": (message: MessageInCachedGuild) => message.guild.ownerID ?? "",
  "[owner_name]": (message: MessageInCachedGuild) => message.guild.owner?.name ?? "",
  "[user_id]": (message: MessageInCachedGuild) => message.author.id,
  "[user_name]": (message: MessageInCachedGuild) => message.author.name,
};
export const isConditional = (sequence: Sequence): sequence is YAMLCordConditional =>
  sequence.type === SequenceType.CONDITIONAL;
export const isFunction = (sequence: Sequence): sequence is YAMLCordFunction => sequence.type === SequenceType.FUNCTION;

export default () => {
  client.on("messageCreate", async (message) => {
    if (!(message.inCachedGuildChannel() && message.guild)) return;

    const guildAutomations = await client.prisma.guildAutomation.findMany({
      where: {
        general: {
          is: {
            trigger: "ON_MESSAGE_CREATE",
            guildId: message.guildID,
          },
        },
      },
    });

    for (const guildAutomation of guildAutomations) {
      const uncompressedBuffer = Buffer.from(ungzip(guildAutomation.general.data)).toString();
      const { sequences } = await new YAMLCordParser().parse(uncompressedBuffer);

      for (const sequence of sequences) {
        if (isConditional(sequence)) {
          await executeConditional(sequence, {
            message,
          });
        } else if (isFunction(sequence)) {
          executeFunction(sequence, {
            message,
          });
        }
      }
    }
  });
};

type MessageInCachedGuild = Message<AnyTextableGuildChannel>;
