import { ClientEvents, defineEventConfig, type EventHandler } from "linkcord";

export const config = defineEventConfig({
	name: ClientEvents.Debug,
});

export const handler: EventHandler<ClientEvents.Debug> = ({ message }) => console.log(message);
