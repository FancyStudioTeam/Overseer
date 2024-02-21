import type { AnyInteractionGateway, EmbedOptions } from "oceanic.js";

export function pagination(
  interaction: AnyInteractionGateway,
  pages: EmbedOptions[]
): void {
  if ("reply" in interaction) {
    pages;
  }
}
