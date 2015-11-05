exports.up = function(knex) {
	return knex.schema.createTable('zones_temps', createTable);
};

exports.down = function(knex) {
	return knex.schema.dropTable('zones_temps');
};

function createTable(table) {
	table.increments('id').primary();
	table.string('zone_id');
	table.string('temp');
	table.timestamp('time');
}
