export const createProgressBar = (current: number, total: number, maxTiles = 10) => {
  const progressBarSymbols = {
    fill: "▰",
    empty: "▱",
  };
  const totalProgress = current + total;
  const currentProgress = Math.round((current / totalProgress) * maxTiles);
  const emptyProgress = Math.round((total / totalProgress) * maxTiles);

  return [progressBarSymbols.fill.repeat(currentProgress), progressBarSymbols.empty.repeat(emptyProgress)].join("");
};
