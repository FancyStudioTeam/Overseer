import { Timestamp } from "@sapphire/time-utilities";

export const formatTimestamp = (
  date: Date | string,
  {
    longFormat,
    use12Hours,
  }: {
    longFormat?: boolean;
    use12Hours?: boolean;
  } = {},
) => {
  return new Timestamp(
    longFormat ? (use12Hours ? "DD/MM/YYYY[, ]hh:mm:ss A" : "DD/MM/YYYY[, ]HH:mm:ss") : "DD/MM/YYYY",
  ).display(date);
};
