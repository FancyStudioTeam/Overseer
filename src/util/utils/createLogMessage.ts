import colors from "@colors/colors";
import { formatTimestamp } from "./formatTimestamp.js";

export enum CreateLogMessageType {
  DEBUG,
  ERROR,
  INFORMATION,
  REQUEST,
  WARNING,
}

const MESSAGE_LOG_TYPES: Record<
  CreateLogMessageType,
  {
    label: string;
    colorFunction: (content: string) => string;
  }
> = {
  [CreateLogMessageType.DEBUG]: {
    label: "DBG",
    colorFunction: colors.brightMagenta,
  },
  [CreateLogMessageType.ERROR]: {
    label: "ERR",
    colorFunction: colors.brightRed,
  },
  [CreateLogMessageType.INFORMATION]: {
    label: "INF",
    colorFunction: colors.brightBlue,
  },
  [CreateLogMessageType.REQUEST]: {
    label: "REQ",
    colorFunction: colors.brightCyan,
  },
  [CreateLogMessageType.WARNING]: {
    label: "WRN",
    colorFunction: colors.brightYellow,
  },
};

const paddingArray = (elements: unknown[]) => ["", ...elements.map((element, _) => ` ${element} `), ""];
const formatLogMessage = (content: string, label: string, colorFunction: (content: string) => string) => {
  const currentDate = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Madrid",
  });
  const formattedTimestamp = formatTimestamp(currentDate);
  const contentBetweenBlocks = paddingArray([formattedTimestamp, label]).join("█");

  return colorFunction([contentBetweenBlocks, content].join(" "));
};

export const createLogMessage = (
  content: string,
  {
    type,
  }: {
    type: CreateLogMessageType;
  } = {
    type: CreateLogMessageType.INFORMATION,
  },
) => {
  const { label, colorFunction } = MESSAGE_LOG_TYPES[type];
  const formattedMessage = formatLogMessage(content, label, colorFunction);

  // biome-ignore lint/suspicious/noConsole:
  // biome-ignore lint/suspicious/noConsoleLog:
  console.log(formattedMessage);
};
