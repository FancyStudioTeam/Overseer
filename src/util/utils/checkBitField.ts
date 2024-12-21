export const checkBitField = (allBitFields: number, bitField: number) =>
  (BigInt(allBitFields) & BigInt(bitField)) === BigInt(bitField);
