exports.up = function(knex) {
	return knex.schema.createTable('sensors_values', createTable);
};

exports.down = function(knex) {
	return knex.schema.dropTable('sensors_values');
};

function createTable(table) {
	table.increments('id').primary();
	table.string('sensor_id');
	table.string('value');
	table.string('raw_meta');
	table.timestamp('time');
}
