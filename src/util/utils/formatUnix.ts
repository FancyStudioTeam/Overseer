export enum UnixType {
  SHORT_TIME,
  SHORT_DATE,
  RELATIVE,
  SHORT_DATE_TIME,
  LONG_DATE_TIME,
  LONG_TIME,
  LONG_DATE,
}

const UNIX_TYPES: Record<UnixType, string> = {
  [UnixType.SHORT_TIME]: "t",
  [UnixType.SHORT_DATE]: "d",
  [UnixType.RELATIVE]: "R",
  [UnixType.SHORT_DATE_TIME]: "f",
  [UnixType.LONG_DATE_TIME]: "F",
  [UnixType.LONG_TIME]: "T",
  [UnixType.LONG_DATE]: "D",
};

export const formatUnix = (
  date: Date,
  {
    type,
  }: {
    type: UnixType;
  } = {
    type: UnixType.RELATIVE,
  },
) => `<t:${Math.floor(date.getTime() / 1000)}:${UNIX_TYPES[type]}>`;
