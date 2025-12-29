import { ClientEvents, defineEventConfig, type EventHandler, Uncached } from 'linkcord';
import { castSnowflake } from 'linkcord/utils';
import { client } from '../../index.js';

export const config = defineEventConfig({
	event: ClientEvents.UserUpdate,
});

export const handler: EventHandler<typeof config> = async ({ newUser, oldUser }) => {
	if (oldUser instanceof Uncached) return;

	const { primaryGuild: oldPrimaryGuild } = oldUser;
	const { primaryGuild: newPrimaryGuild } = newUser;

	if (oldPrimaryGuild?.identityGuildId === newPrimaryGuild?.identityGuildId) return;

	const guildIdSnowflake = castSnowflake('1444770947365339310');
	const roleIdSnowflake = castSnowflake('1454545567308054668');

	if (newPrimaryGuild?.identityGuildId === '81384788765712384') {
		await client.rest.resources.guilds.putGuildMemberRole(guildIdSnowflake, newUser.id, roleIdSnowflake);
	} else {
		await client.rest.resources.guilds.deleteGuildMemberRole(guildIdSnowflake, newUser.id, roleIdSnowflake);
	}
};
