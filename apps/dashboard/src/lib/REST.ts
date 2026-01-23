import 'server-only';

import { REST } from '@discordjs/rest';
import { CLIENT_TOKEN } from './Constants.ts';

export const rest = new REST({
	version: '10',
});

rest.setToken(CLIENT_TOKEN);
