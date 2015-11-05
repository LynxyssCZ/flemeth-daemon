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
	table.integer('changes_resolution').unsigned();
	table.float('start_temp').unsigned();
}
