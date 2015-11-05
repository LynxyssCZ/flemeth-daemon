exports.up = function(knex) {
	return knex.schema.createTable('settings', createTable);
};

exports.down = function(knex) {
	return knex.schema.dropTable('settings');
};

function createTable(table) {
	table.increments('id').primary();
	table.string('key').unique();
	table.string('raw_value');
}
