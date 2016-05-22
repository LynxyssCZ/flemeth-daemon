'use strict';
const Knex = require('knex');
const Bookshelf = require('bookshelf');

class FlemDB {
	constructor(knexConfig) {
		this.knex = new Knex(knexConfig);
		this.bookshelf = Bookshelf(this.knex);
		this.bookshelf.plugin(['virtuals', 'registry', 'visibility', 'bookshelf-camelcase']);
	}

	init(next) {
		// This should be done inside registerTable method
		this.models = require('./models')(this.bookshelf);
		this.knex.migrate.latest()
			.then(function() {
				next(null);
			});
	}

	stop() {
		this.knex.destroy();
	}

	getModel(name) {
		return this.models[name].Model;
	}

	getCollection(name) {
		return this.models[name].Collection;
	}

	registerTable(name, model, migrationsDir) {
		throw new Error('Not implemented yet');
	}
}

module.exports = FlemDB;
