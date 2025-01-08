import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const getDirnameFromFileUrl = (url: string): string => dirname(fileURLToPath(url));
