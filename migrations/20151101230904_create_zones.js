exports.up = function(knex) {
	return knex.schema.createTable('zones', createTable);
};

exports.down = function(knex) {
	return knex.schema.dropTable('zones');
};

function createTable(table) {
	table.increments('id').primary();
	table.string('name').unique();
	table.string('raw_sensors');
	table.float('priority', 4).unsigned();
}
