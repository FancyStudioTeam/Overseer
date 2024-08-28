import { Result } from "@sapphire/result";
import type { ComponentInteraction } from "oceanic.js";
import { Developers } from "#constants";
import { client } from "#index";
import type { Locales } from "#types";
import { handleError } from "#util/Util";

export const handleButton = async (
  key: string,
  {
    handleArguments,
    context,
  }: {
    handleArguments: {
      locale: Locales;
      premium: boolean;
      variable?: unknown;
    };
    context: ComponentInteraction;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;

  const component = client.components.buttons.get(key);

  if (component) {
    if (component.developerOnly && !Developers.includes(context.user.id)) {
      return await context.deferUpdate();
    }

    const result = await Result.fromAsync<unknown, Error>(
      async () =>
        await component.run({
          ...handleArguments,
          context,
        }),
    );

    if (result.isErr()) {
      return await handleError(result.unwrapErr(), {
        context,
      });
    }
  }
};
