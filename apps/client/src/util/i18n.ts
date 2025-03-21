import { createInstance } from "i18next";
import enCommands from "../locales/en/commands.json" with { type: "json" };
import enCommon from "../locales/en/common.json" with { type: "json" };
import esCommands from "../locales/es/commands.json" with { type: "json" };
import esCommon from "../locales/es/common.json" with { type: "json" };
import { CUSTOM_EMOJIS } from "./constants.js";
import type { Locales, TCommands, TCommon } from "./types.js";

export const i18n = createInstance();

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
  interpolation: {
    defaultVariables: {
      ...CUSTOM_EMOJIS,
    },
    escapeValue: false,
  },
});

/** A function to translate the messages from the commands namespace. */
export const tCommandsFunction = (locale: Locales): TCommands => i18n.getFixedT(locale.toLowerCase(), "commands");
/** A function to translate the messages from the common namespace. */
export const tCommonFunction = (locale: Locales): TCommon => i18n.getFixedT(locale.toLowerCase(), "common");

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
