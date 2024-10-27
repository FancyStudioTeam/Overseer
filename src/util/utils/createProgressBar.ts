export const createProgressBar = (current: number, total: number, maxTiles = 10) => {
  const progressBarSymbols = {
    fill: "▰",
    empty: "▱",
  };
  const currentProgress = Math.round((current / total) * maxTiles);
  const emptyProgress = maxTiles - currentProgress;

  return [progressBarSymbols.fill.repeat(currentProgress), progressBarSymbols.empty.repeat(emptyProgress)].join("");
};
