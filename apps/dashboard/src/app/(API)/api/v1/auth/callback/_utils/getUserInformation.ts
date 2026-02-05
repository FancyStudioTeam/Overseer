import 'server-only';

import { REST } from '@discordjs/rest';
import { type RESTGetAPIUserResult, Routes } from 'discord-api-types/v10';

const { user } = Routes;

/**
 * @see https://discord.com/developers/docs/resources/user#get-current-user
 */
export async function getUserInformation(
	accessToken: string,
): Promise<RESTGetAPIUserResult> {
	const rest = new REST({
		authPrefix: 'Bearer',
	}).setToken(accessToken);

	const response = await rest.get(user('@me'));

	return response as RESTGetAPIUserResult;
}
