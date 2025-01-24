import i18next from "i18next";
import enCommands from "../locales/en/commands.json" with { type: "json" };
import esCommands from "../locales/es/commands.json" with { type: "json" };

export const i18n = i18next.createInstance();

i18n.init({
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

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "commands";
    resources: {
      commands: Commands;
    };
  }
}

type Commands = typeof enCommands | typeof esCommands;
