
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('plans'),
		knex.schema.dropTable('schedules')
	]);
};

exports.down = function(knex, Promise) {

};
