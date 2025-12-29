import { ClientEvents, defineEventConfig, type EventHandler, Uncached } from 'linkcord';
import { client } from '../../index.js';

export const config = defineEventConfig({
	name: ClientEvents.UserUpdate,
});

export const handler: EventHandler<ClientEvents.UserUpdate> = ({ newUser, oldUser }) => {
	if (oldUser instanceof Uncached) return;

	const { primaryGuild: oldPrimaryGuild } = oldUser;
	const { primaryGuild: newPrimaryGuild } = newUser;

	if (oldPrimaryGuild?.identityGuildId === newPrimaryGuild?.identityGuildId) return;

	if (newPrimaryGuild?.identityGuildId === '81384788765712384') {
		client.rest.resources.guilds.putGuildMemberRole('1444770947365339310', '');
	}
};
