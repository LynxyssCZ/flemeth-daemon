module.exports = function register(Bookshelf) {
	const Change = Bookshelf.Model.extend({
		tableName: 'schedule_changes'
	});

	const Changes = Bookshelf.Collection.extend({
		model: Change
	});

	const tableCreate = function createTable(table) {
		table.increments('id').primary();
		table.integer('day');
		table.integer('start_time');
		table.integer('length');
		table.float('new_temp');
		table.float('new_hyst');
		table.boolean('is_active');
		table.string('tag', 60);
	};

	const updateSchema = function updateSchedulesSchema(currentVersion, knex) {
		return knex.schema.dropTableIfExists('schedule_changes')
			.createTable('schedule_changes', tableCreate);
	};

	return {
		version: 1,
		Model: Bookshelf.model('Change', Change),
		Collection: Bookshelf.collection('Changes', Changes),
		update: updateSchema
	};
};
