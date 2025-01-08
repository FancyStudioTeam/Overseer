import i18next from "i18next";
import en from "../locales/en.json" with { type: "json" };
import es from "../locales/es.json" with { type: "json" };

export const i18n = i18next.createInstance();

i18n.init({
  fallbackLng: "en",
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },
});

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      en: typeof en;
      es: typeof es;
    };
  }
}
