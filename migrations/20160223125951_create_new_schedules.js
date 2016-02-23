
exports.up = function(knex, Promise) {
	return knex.schema.createTable('schedules', createTable);
};

exports.down = function(knex, Promise) {

};

function createTable(table) {
	table.increments('id').primary();
	table.string('name').unique();
	table.string('raw_changes');
	table.float('start_temp').unsigned();
	table.float('start_hyst').unsigned();
}
