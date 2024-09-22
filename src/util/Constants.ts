import { Development, Production } from "./Emojis.js";

export const Colors = {
  COLOR: 0x2b2d31,
  GREEN: /*0x10b981*/ 0x2b2d31,
  ORANGE: /*0xfbbf24*/ 0x2b2d31,
  RED: /*0xf43f5e*/ 0x2b2d31,
};

export const Developers = ["945029082314338407"];

export const Emojis = process.env.NODE_ENV === "development" ? Development : Production;

export const Links = {
  INVITE: "https://discord.com/oauth2/authorize?client_id=1228065406196125810&permissions=117760&scope=bot",
  SUPPORT: "https://discord.gg/gud55BjNFC",
  WEBSITE: "https://overseerbot.pages.dev",
};
