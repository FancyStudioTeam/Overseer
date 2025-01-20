import i18next from "i18next";
import enCommands from "../locales/en/commands.json" with { type: "json" };
import esCommands from "../locales/es/commands.json" with { type: "json" };

export const i18n = i18next.createInstance();

/**
 * i18next uses "namespaces" to split the translations into multiple JSON files.
 * "commands" namespace is used for the commands translations.
 */
i18n.init({
  // biome-ignore lint/style/useNamingConvention: Cannot be changed.
  defaultNS: "commands",
  fallbackLng: "en",
  ns: ["commands"],
  resources: {
    en: {
      commands: enCommands,
    },
    es: {
      commands: esCommands,
    },
  },
});

/**
 * Adds embedded type definitions for some i18next properties and methods.
 */
declare module "i18next" {
  interface CustomTypeOptions {
    // biome-ignore lint/style/useNamingConvention: Cannot be changed.
    defaultNS: "commands";
    resources: {
      commands: Commands;
    };
  }
}

type Commands = typeof enCommands | typeof esCommands;
