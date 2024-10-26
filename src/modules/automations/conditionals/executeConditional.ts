import { apply } from "json-logic-js";
import type { Message } from "oceanic.js";
import type { YAMLCordConditional, YAMLCordSequence, YAMLCordVariables } from "yamlcord";
import { isConditional, isFunction } from "../../Automations.js";
import { executeFunction } from "../functions/executeFunction.js";

const createForOfSequences = async (
  yamlCordSequences: YAMLCordSequence[],
  {
    message,
  }: {
    message: Message;
  },
) => {
  for (const sequence of yamlCordSequences) {
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
};

export const executeConditional = async (
  yamlCordConditional: YAMLCordConditional,
  {
    message,
  }: {
    message: Message;
  },
) => {
  if (!(message.inCachedGuildChannel() && message.guild)) return;

  const { data } = yamlCordConditional;
  const variablesMap: Record<YAMLCordVariables, string | number> = {
    "[date_now]": Date.now(),
    "[guild_id]": message.guildID,
    "[guild_name]": message.guild.name,
    "[message_content]": message.content,
    "[owner_id]": message.guild.ownerID ?? "",
    "[owner_name]": message.guild.owner?.name ?? "",
    "[user_id]": message.author.id,
    "[user_name]": message.author.name,
  };

  if (
    apply({
      [data.if.operator]: [variablesMap[data.if.variable as YAMLCordVariables], data.if.value],
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
