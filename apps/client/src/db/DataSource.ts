import 'reflect-metadata';

import { env } from 'node:process';
import { DataSource } from 'typeorm';
import { GuildSettingsModel } from './models/GuildSettingsModel.js';

const {
	MONGO_DB_CONNECTION_URL = 'mongodb://localhost:27017',
	MONGO_DB_DATABASE_NAME = 'database',
} = env;

export const AppDataSource = new DataSource({
	database: MONGO_DB_DATABASE_NAME,
	entities: [
		GuildSettingsModel,
	],
	synchronize: true,
	type: 'mongodb',
	url: MONGO_DB_CONNECTION_URL,
});

await AppDataSource.initialize();
