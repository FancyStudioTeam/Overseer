import { Loader } from "@structures/Loader.js";

/** Initializes the application by importing all modules and files. */
export const initialize = async () => await new Loader()._init();
