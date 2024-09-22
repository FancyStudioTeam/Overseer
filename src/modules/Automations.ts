import { ungzip } from "pako";
import { type Conditional, type Function, type Sequence, SequenceType, YAMLCord } from "yamlcord";
import { client } from "#index";
import { prisma } from "#util/Prisma.js";
import { executeConditional } from "./automations/conditionals/executeConditional.js";
import { executeFunction } from "./automations/functions/executeFunction.js";

const yamlCord = new YAMLCord();
export const isConditional = (sequence: Sequence): sequence is Conditional =>
  sequence.type === SequenceType.CONDITIONAL;
export const isFunction = (sequence: Sequence): sequence is Function => sequence.type === SequenceType.FUNCTION;

export default () => {
  client.on("messageCreate", async (message) => {
    if (!(message.inCachedGuildChannel() && message.guild)) return;

    const allAutomations = await prisma.guildAutomation.findMany({
      where: {
        general: {
          is: {
            trigger: "ON_MESSAGE_CREATE",
          },
        },
        guildId: message.guildID,
      },
    });
    const guildAutomation = allAutomations[0];

    if (guildAutomation) {
      const uncompressedBuffer = ungzip(guildAutomation.general.data);
      const { sequences } = await yamlCord.createSequencesFromData(Buffer.from(uncompressedBuffer).toString());

      for (const sequence of sequences) {
        if (isConditional(sequence)) {
          await executeConditional(sequence, {
            message,
          });
        } else if (isFunction(sequence)) {
          await executeFunction(sequence, {
            message,
          });
        }
      }
    }
  });
};
