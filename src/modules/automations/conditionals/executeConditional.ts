import { apply } from "json-logic-js";
import type { Message } from "oceanic.js";
import type { Conditional, Sequence } from "yamlcord";
import { isConditional, isFunction } from "../../Automations.js";
import { executeFunction } from "../functions/executeFunction.js";

const createForOfSequences = async (
  sequences: Sequence[],
  {
    message,
  }: {
    message: Message;
  },
) => {
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
};

export const executeConditional = async (
  conditional: Conditional,
  {
    message,
  }: {
    message: Message;
  },
) => {
  if (!(message.inCachedGuildChannel() && message.guild)) return;

  const { data } = conditional;
  const variablesMap: Record<string, string> = {
    "[message.content]": message.content,
    "[message.user_id]": message.author.id,
  };

  if (
    apply({
      [data.if.operator]: [variablesMap[data.if.variable], data.if.value],
    })
  ) {
    await createForOfSequences(data.then, {
      message,
    });
  } else if (data.else) {
    await createForOfSequences(data.else, {
      message,
    });
  }
};
