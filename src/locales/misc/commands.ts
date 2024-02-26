type Value = Record<string, string>;
type Descriptions = Record<string, Value>;

export const descriptions: Descriptions = {
  CONFIG_LANGUAGE: {
    en: "Sets the bot language",
    es: "Establece el idioma del bot",
  },
  CONFIG_PREMIUM_CLAIM: {
    en: "Claims a premium membership",
    es: "Reclama una membresía premium",
  },
  CONFIG_PREMIUM_REVOKE: {
    en: "Revokes premium server membership",
    es: "Revoca la membresía premium del servidor",
  },
  CONFIG_SUGGESTIONS: {
    en: "Configures the suggestion system",
    es: "Configura el sistema de sugerencias",
  },
  CONFIG_TIMEZONE: {
    en: "Sets the bot's time zone",
    es: "Establece la zona horaria del bot",
  },
  INFO_BOT: {
    en: "Displays bot information",
    es: "Muestra la información del bot",
  },
  INFO_PING: {
    en: "Displays bot latency",
    es: "Muestra la latencia del bot",
  },
  INFO_SERVER: {
    en: "Displays server information",
    es: "Muestra la información del servidor",
  },
  INFO_USER: {
    en: "Displays a user's information",
    es: "Muestra la información de un usuario",
  },
  MOD_BAN: {
    en: "Bans a user",
    es: "Banea a un usuario",
  },
  MOD_KICK: {
    en: "Kicks a user",
    es: "Expulsa a un usuario",
  },
  MOD_PURGE: {
    en: "Removes messages from a channel",
    es: "Elimina mensajes de un canal",
  },
  MOD_SLOWMODE: {
    en: "Adds a timeout to a channel",
    es: "Añade un tiempo de espera a un canal",
  },
  MOD_TIMEOUT: {
    en: "Adds a timeout to a user",
    es: "Añade un tiempo de espera a un usuario",
  },
  MOD_WARN_ADD: {
    en: "Warns a user",
    es: "Advierte a un usuario",
  },
  MOD_WARN_REMOVE: {
    en: "Removes a user's warning",
    es: "Elimina una advertencia de un usuario",
  },
  MOD_WARN_LIST: {
    en: "Displays a user's warnings",
    es: "Muestra las advertencias de un usuario",
  },
  UTIL_AVATAR: {
    en: "Displays user's avatar",
    es: "Muestra el avatar de un usuario",
  },
  UTIL_WEATHER: {
    en: "Displays the weather for a location",
    es: "Muestra el clima de una ubicación",
  },
};
