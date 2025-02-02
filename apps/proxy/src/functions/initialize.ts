import { Importer } from "@structures/Importer.js";

/**
 * Initializes the application.
 * @returns Nothing.
 */
export const initialize = async () => await new Importer().init();
