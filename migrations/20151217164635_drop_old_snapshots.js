
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('sensors_values'),
		knex.schema.dropTable('zones_temps')
	]);
};

exports.down = function(knex, Promise) {

};
