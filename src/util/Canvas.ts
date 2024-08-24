import { join, sep } from "node:path";
import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";
import { glob } from "glob";

const loadFonts = async () => {
  await glob(`${join(process.cwd(), "assets/fonts")}/**.ttf`).then((paths) => {
    for (const path of paths) {
      const fontName = path.split(sep)[2].split(".")[0];

      GlobalFonts.registerFromPath(path, fontName);
    }
  });
};

export const createErrorCardImage = async (reportID: string) => {
  await loadFonts();

  const canvas = createCanvas(1790, 900);
  const context = canvas.getContext("2d");
  const padding = 30;
  const background = await loadImage(join(process.cwd(), "assets/Images", "Background.png"));

  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(0, 0, 0, 0.9)";
  context.fillRect(padding, padding, canvas.width - 2 * padding, canvas.height - 2 * padding);

  context.font = `100px ${PlusJakartaSans.EXTRA_BOLD}`;
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("Something went wrong", canvas.width / 2, canvas.height / 2);

  context.font = `50px ${PlusJakartaSans.MEDIUM}`;
  context.fillText("We have sent a report to our support", canvas.width / 2, canvas.height / 2 + 100);

  context.font = `30px ${PlusJakartaSans.MEDIUM}`;
  context.fillText(`Report ID: ${reportID}`, canvas.width / 2, canvas.height - 130);

  return canvas.toBuffer("image/png");
};

enum PlusJakartaSans {
  EXTRA_BOLD = "PlusJakartaSansExtraBold",
  MEDIUM = "PlusJakartaSansMedium",
}
