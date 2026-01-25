import {
	Column,
	CreateDateColumn,
	Entity,
	type ObjectId,
	ObjectIdColumn,
	UpdateDateColumn,
} from 'typeorm';

enum GuildSettingsLocale {
	English = 'EN',
	Spanish = 'ES',
}

@Entity({
	name: 'guild-settings',
})
export class GuildSettingsModel {
	@ObjectIdColumn()
	declare _id: ObjectId;

	@CreateDateColumn()
	declare createdAt: Date;

	@Column('string')
	declare guildId: string;

	@Column('string', {
		default: GuildSettingsLocale.English,
	})
	readonly locale: GuildSettingsLocale = GuildSettingsLocale.English;

	@UpdateDateColumn()
	declare modifiedAt: Date;
}
