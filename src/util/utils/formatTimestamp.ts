import { Timestamp } from "@sapphire/time-utilities";

export const formatTimestamp = (date: Date | string, pattern = "DD/MM/YYYY[, ]HH:mm:ss") =>
  new Timestamp(pattern).display(date);
