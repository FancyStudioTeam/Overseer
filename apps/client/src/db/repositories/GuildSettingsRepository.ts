import {
	Column,
	CreateDateColumn,
	Entity,
	type ObjectId,
	ObjectIdColumn,
	UpdateDateColumn,
} from 'typeorm';
import { AppDataSource } from '#db/DataSource.js';

@Entity({
	name: 'guild-settings',
})
export class GuildSettingsModel {
	@ObjectIdColumn()
	declare _id: ObjectId;

	@CreateDateColumn({
		name: 'created_at',
	})
	declare createdAt: Date;

	@Column({
		name: 'guild_id',
	})
	declare guildId: string;

	@UpdateDateColumn({
		name: 'modified_at',
	})
	declare modifiedAt: Date;
}

export const GuildSettingsRepository = AppDataSource.getMongoRepository(GuildSettingsModel);
