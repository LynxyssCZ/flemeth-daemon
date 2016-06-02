module.exports = function register(Bookshelf) {
	const Setting = Bookshelf.Model.extend({
		tableName: 'settings',
		hidden: ['id', 'raw_value', 'rawValue'],
		virtuals: {
			value: {
				get: function() {
					const rawValue = this.get('rawValue');

					if (rawValue) {
						// FIXME: YOLO
						return JSON.parse(rawValue);
					}
					else {
						return undefined;
					}
				},
				set: function(value) {
					if (value) {
						// FIXME: Double YOLO
						this.set('rawValue', JSON.stringify(value));
					}
					else {
						this.set('rawValue', null);
					}
				}
			}
		}
	});

	const Settings = Bookshelf.Collection.extend({
		model: Setting
	});

	const tableCreate = function createTable(table) {
		table.increments('id').primary();
		table.string('key').unique();
		table.string('raw_value');
	};

	const updateSchema = function updateSchedulesSchema(currentVersion, knex) {
		return knex.schema.dropTableIfExists('settings')
			.createTable('settings', tableCreate);
	};

	return {
		version: 1,
		update: updateSchema,
		Model: Bookshelf.model('Setting', Setting),
		Collection: Bookshelf.collection('Settings', Settings)
	};
};
