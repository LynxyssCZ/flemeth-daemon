exports.up = function(knex) {
	return knex.schema
	.createTable('zones', createZonesTable);
};

exports.down = function(knex) {
	return knex.schema.dropTable('zones');
};

function createZonesTable(table) {
	table.increments('id').primary();
	table.string('name').unique();
	table.string('raw_sensors');
	table.integer('priority').unsigned();
}
