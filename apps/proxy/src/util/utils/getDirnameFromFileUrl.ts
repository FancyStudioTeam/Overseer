import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const getDirnameFromFileUrl = (url: string) => dirname(fileURLToPath(url));
