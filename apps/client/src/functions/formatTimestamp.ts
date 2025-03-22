import { Timestamp } from "@sapphire/time-utilities";

/**
 * Formats a timestamp using the given pattern.
 * @param timestamp - The timestamp to format.
 * @param pattern - The pattern to use.
 * @returns The formatted UTC timestamp with the given pattern.
 */
export const formatTimestamp = (timestamp: AnyTimestamp, pattern = "DD/MM/YYYY HH:mm:ss"): string =>
  `${new Timestamp(pattern).displayUTC(timestamp)} UTC`;

type AnyTimestamp = Date | string | number;
