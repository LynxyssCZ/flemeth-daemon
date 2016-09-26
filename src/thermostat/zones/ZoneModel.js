'use strict';
module.exports = function register(Bookshelf) {
	const Zone = Bookshelf.Model.extend({
		tableName: 'zones',
		hidden: ['raw_sensors', 'rawSensors'],
		virtuals: {
			sensors: {
				get: function() {
					var rawSensors = this.get('rawSensors');

					if (rawSensors) {
						return rawSensors.split(';');
					}
					else {
						return [];
					}
				},
				set: function(value) {
					if (value) {
						this.set('rawSensors', value.join(';'));
					}
					else {
						this.set('rawSensors', null);
					}
				}
			}
		}
	});

	const Zones = Bookshelf.Collection.extend({
		model: Zone
	});

	const tableCreate = function createTable(table) {
		table.increments('id').primary();
		table.string('name').unique();
		table.string('raw_sensors');
		table.float('priority', 4).unsigned();
	};

	const updateSchema = function updateSchedulesSchema(currentVersion, knex) {
		return knex.schema.dropTableIfExists('zones')
			.createTable('zones', tableCreate);
	};

	return {
		version: 1,
		Model: Bookshelf.model('Zone', Zone),
		Collection: Bookshelf.collection('Zones', Zones),
		update: updateSchema
	};
};
