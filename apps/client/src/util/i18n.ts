import i18next from "i18next";
import enCommands from "../locales/en/commands.json" with { type: "json" };
import esCommands from "../locales/es/commands.json" with { type: "json" };

export const i18n = i18next.createInstance();

i18n.init({
  // biome-ignore lint/style/useNamingConvention: Can not be changed.
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
 * Adds embedded type definitions to the i18next instance.
 */
declare module "i18next" {
  interface CustomTypeOptions {
    // biome-ignore lint/style/useNamingConvention: Can not be changed.
    defaultNS: "commands";
    resources: {
      commands: typeof enCommands | typeof esCommands;
    };
  }
}
