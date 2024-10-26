import colors from "@colors/colors";
import { formatTimestamp } from "./formatTimestamp.js";

const array = (elements: string[]): string[] => ["", ...elements, ""];
const spaces = (content: string, max: number): string => {
  const spaces = " ".repeat(max);

  return [spaces, content, spaces].join("");
};
export const logger = (
  content: string,
  {
    type,
  }: {
    type: LoggerType;
  } = {
    type: LoggerType.INFORMATION,
  },
) => {
  const timestamp = spaces(
    formatTimestamp(
      new Date().toLocaleString("en-US", {
        timeZone: "Europe/Madrid",
      }),
    ),
    1,
  );
  const levels: Record<LoggerType, string> = {
    [LoggerType.DEBUG]: colors.brightMagenta(
      [array([timestamp, spaces("DBG", 1)]).join(colors.bgBrightMagenta(" ")), content].join(" "),
    ),
    [LoggerType.ERROR]: colors.brightRed(
      [array([timestamp, spaces("ERR", 1)]).join(colors.bgBrightRed(" ")), content].join(" "),
    ),
    [LoggerType.INFORMATION]: colors.brightBlue(
      [array([timestamp, spaces("INF", 1)]).join(colors.bgBrightBlue(" ")), content].join(" "),
    ),
    [LoggerType.REQUEST]: colors.brightCyan(
      [array([timestamp, spaces("REQ", 1)]).join(colors.bgBrightCyan(" ")), content].join(" "),
    ),
    [LoggerType.WARNING]: colors.brightYellow(
      [array([timestamp, spaces("WRN", 1)]).join(colors.bgBrightYellow(" ")), content].join(" "),
    ),
  };

  // biome-ignore lint/suspicious/noConsole:
  // biome-ignore lint/suspicious/noConsoleLog:
  console.log(levels[type]);
};

export enum LoggerType {
  DEBUG,
  ERROR,
  INFORMATION,
  REQUEST,
  WARNING,
}
