exports.up = function(knex) {
	return knex.schema.createTable('plans', createTable);
};

exports.down = function(knex) {
	return knex.schema.dropTable('plans');
};

function createTable(table) {
	table.increments('id').primary();
	table.string('name').unique();
	table.string('raw_schedules');
}
