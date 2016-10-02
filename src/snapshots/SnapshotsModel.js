'use strict';
module.exports = function register(Bookshelf) {
	const Snapshot = Bookshelf.Model.extend({
		tableName: 'snapshots',
		hidden: ['id', 'raw_data', 'rawData'],
		virtuals: {
			data: {
				get: function() {
					const rawData = this.get('rawData');

					if (rawData) {
						return JSON.parse(rawData);
					}
					else {
						return undefined;
					}
				},
				set: function(data) {
					if (data) {
						this.set('rawData', JSON.stringify(data));
					}
					else {
						this.set('rawData', null);
					}
				}
			}
		}
	});

	const Snapshots = Bookshelf.Collection.extend({
		model: Snapshot
	});

	const tableCreate = function createTable(table) {
		table.increments('id').primary();
		table.string('type');
		table.string('raw_data');
		table.timestamp('time');
	};

	const updateSchema = function updateSchedulesSchema(currentVersion, knex) {
		return knex.schema.dropTableIfExists('snapshots')
			.createTable('snapshots', tableCreate);
	};

	return {
		version: 1,
		update: updateSchema,
		Model: Bookshelf.model('Snapshot', Snapshot),
		Collection: Bookshelf.collection('Snapshots', Snapshots)
	};
};
