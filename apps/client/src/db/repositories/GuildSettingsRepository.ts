import { AppDataSource } from '#db/DataSource.js';
import { GuildSettingsModel } from '#db/models/GuildSettingsModel.js';

export const GuildSettingsRepository = AppDataSource.getMongoRepository(GuildSettingsModel);
