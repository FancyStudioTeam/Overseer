import { client } from "@index";
import { ungzip } from "pako";
import { type Conditional, type Function, type Sequence, SequenceType, YAMLCord } from "yamlcord";
import { executeConditional } from "./automations/conditionals/executeConditional.js";
import { executeFunction } from "./automations/functions/executeFunction.js";

const yamlCord = new YAMLCord();
export const isConditional = (sequence: Sequence): sequence is Conditional =>
  sequence.type === SequenceType.CONDITIONAL;
export const isFunction = (sequence: Sequence): sequence is Function => sequence.type === SequenceType.FUNCTION;

export default () => {
  client.on("messageCreate", async (message) => {
    if (!(message.inCachedGuildChannel() && message.guild)) return;

    const guildAutomations = await client.prisma.guildAutomation.findMany({
      where: {
        general: {
          is: {
            trigger: "ON_MESSAGE_CREATE",
          },
        },
        guildId: message.guildID,
      },
    });

    for (const guildAutomation of guildAutomations) {
      const uncompressedBuffer = Buffer.from(ungzip(guildAutomation.general.data)).toString();
      const { sequences } = await yamlCord.createSequencesFromData(uncompressedBuffer);

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
