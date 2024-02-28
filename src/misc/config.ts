import emojis from "./emojis";

export default {
  colors: {
    color: 0x2b2d31,
    success: 0x2b2d31,
    error: 0x2b2d31,
    warning: 0x2b2d31,
  },
  links: {
    invite:
      "https://discord.com/oauth2/authorize?client_id=1167172866823954582&permissions=277025737728&scope=bot",
    support: "https://discord.gg/RPt73adMBq",
  },
  developers: ["945029082314338407", "1200870671681605662"],
  emojis: emojis,
};

export interface Config {
  colors: {
    color: number;
    success: number;
    error: number;
    warning: number;
  };
  links: {
    invite: string;
    support: string;
  };
  developers: string[];
  emojis: Record<keyof typeof emojis, string>;
}
