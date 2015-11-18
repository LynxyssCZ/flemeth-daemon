exports.up = function(knex) {
	return knex.schema.createTable('schedules', createTable);
};

exports.down = function(knex) {
	return knex.schema.dropTable('schedules');
};

function createTable(table) {
	table.increments('id').primary();
	table.string('name').unique();
	table.string('raw_changes');
	table.float('start_temp').unsigned();
	table.float('hysteresis').unsigned();
}
