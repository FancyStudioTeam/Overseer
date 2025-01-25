import i18next from "i18next";
import enCommands from "../locales/en/commands.json" with { type: "json" };
import enCommon from "../locales/en/common.json" with { type: "json" };
import esCommands from "../locales/es/commands.json" with { type: "json" };
import esCommon from "../locales/es/common.json" with { type: "json" };

export const i18n = i18next.createInstance();

i18n.init({
  defaultNS: "commands",
  fallbackLng: "en",
  ns: ["commands", "common"],
  resources: {
    en: {
      commands: enCommands,
      common: enCommon,
    },
    es: {
      commands: esCommands,
      common: esCommon,
    },
  },
});

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "commands";
    resources: {
      commands: Commands;
      common: Common;
    };
  }
}

type Commands = typeof enCommands | typeof esCommands;
type Common = typeof enCommon | typeof esCommon;
