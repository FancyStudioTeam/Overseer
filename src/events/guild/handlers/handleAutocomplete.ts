import { client } from "@index";
import type { Locales } from "@types";
import type { AutocompleteInteraction } from "oceanic.js";

export const handleAutocomplete = async (
  context: AutocompleteInteraction,
  collectionKey: string,
  {
    isPremium,
    locale,
  }: {
    isPremium: boolean;
    locale: Locales;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;

  const command = client.interactions.chatInput.get(collectionKey);

  if (command?.autoComplete) {
    await command.autoComplete({
      client,
      context,
      isPremium,
      locale,
    });
  }
};
