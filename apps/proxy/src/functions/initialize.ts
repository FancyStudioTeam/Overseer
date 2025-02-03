import { Loader } from "@structures/Loader.js";

/**
 * Initializes the application by importing all modules and files.
 * @returns Nothing.
 */
export const initialize = async () => await new Loader().initImports();
