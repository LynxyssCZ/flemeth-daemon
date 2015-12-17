
exports.up = function(knex) {
	return knex.schema.createTable('snapshots', createTable);
};

exports.down = function() {

};

function createTable(table) {
	table.increments('id').primary();
	table.string('type');
	table.string('raw_data');
	table.timestamp('time');
}
