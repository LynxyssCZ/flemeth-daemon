var Knex = require('knex');
var Bookshelf = require('bookshelf');

var FlemDB = module.exports = {
	bookshelf: null,
	models: null,
	config: function(options, next) {
		var knex = Knex(options.knexFile);
		var bookshelf = FlemDB.bookshelf = Bookshelf(knex);
		bookshelf.plugin(['virtuals', 'registry', 'visibility', 'bookshelf-camelcase']);
		FlemDB.models = require('./models')(bookshelf);

		knex.migrate.latest()
			.then(function() {
				next(null);
			});
	},
	getModel: function(name) {
		return FlemDB.models[name].Model;
	},
	getCollection: function(name) {
		return FlemDB.models[name].Collection;
	}
};
