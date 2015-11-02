var Knex = require('knex');
var Bookshelf = require('bookshelf');
var mkdirp = require('mkdirp');
var path = require('path');

var FlemDB = module.exports = {
	bookshelf: null,
	models: null,
	config: function(options, next) {
		mkdirp(path.dirname(options.knexFile.connection.filename), function(err) {
			if (err) {
				return next(err);
			}

			var knex = Knex(options.knexFile);
			var bookshelf = FlemDB.bookshelf = Bookshelf(knex);
			bookshelf.plugin('virtuals');
			bookshelf.plugin('registry');
			bookshelf.plugin('visibility');
			FlemDB.models = require('./models')(bookshelf);

			knex.migrate.latest()
				.then(function() {
					next(null);
				});
		});
	},
	getModel: function(name) {
		return FlemDB.models[name].Model;
	},
	getCollection: function(name) {
		return FlemDB.models[name].Collection;
	}
};
