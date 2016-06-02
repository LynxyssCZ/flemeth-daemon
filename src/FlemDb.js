'use strict';
const Knex = require('knex');
const Bookshelf = require('bookshelf');

// IDEA: Plugin-ize DB, server and Flux core
class FlemDB {
	constructor(app, options) {
		this.app = app;
		this.logger = app.logger.child({component: 'FlemDB'});
		this.knexConfig = options;
		this.models = {};

		this.knex = new Knex(this.knexConfig);
		this.bookshelf = Bookshelf(this.knex);
		this.bookshelf.plugin(['virtuals', 'registry', 'visibility', 'bookshelf-camelcase']);

		this.app.addMethod('db.registerModel', this.registerModel.bind(this));
		this.app.addMethod('db.getModel', this.getModel.bind(this));
		this.app.addMethod('db.getCollection', this.getCollection.bind(this));
		this.app.addHook('lifecycle.start', this.onAppStart.bind(this));
		this.app.addHook('lifecycle.stop', this.onAppStop.bind(this));
	}

	onAppStart(payload, next) {
		this.logger.info('Starting migrations');

		if (this.knex === undefined) {
			this.knex = new Knex(this.knexConfig);
			this.bookshelf.knex = this.knex;
		}

		return this._upgradeAllSchemas()
		.then(() => {
			this.logger.info('Migrations done');
			next(null);
		}).catch(next);
	}

	onAppStop(paylod, next) {
		this.logger.info('Cleaning up');

		this.knex.destroy();
		this.knex = undefined;

		next();
	}

	getModel(name) {
		return this.models[name].Model;
	}

	getCollection(name) {
		return this.models[name].Collection;
	}

	registerModel(name, model) {
		this.models[name] = model(this.bookshelf);
	}

	_createSchemaVersionTable(table) {
		table.string('name').primary();
		table.integer('version');
		table.dateTime('last_update');
	}

	_upgradeAllSchemas() {
		return this._initVersions()
			.bind(this)
			.then(this._getCurrentVersions)
			.then(this._performUpgrades);
	}

	_performUpgrades(currentVersions) {
		return Promise.all(
			Object.keys(this.models).filter(function(model) {
				return this.models[model].update && (!currentVersions[model] || currentVersions[model] !== this.models[model].version);
			}, this).map(function(model) {
				return this.models[model].update(currentVersions[model], this.knex)
					.then(() => {
						if (currentVersions[model]) {
							return this.knex('schema_versions')
							.where({name: model})
							.update({
								version: this.models[model].version,
								last_update: Date.now()
							});
						}
						else {
							return this.knex('schema_versions')
							.insert({
								name: model,
								version: this.models[model].version,
								last_update: Date.now()
							});
						}
					});
			}, this)
		);
	}

	_getCurrentVersions() {
		return this.knex('schema_versions')
			.select()
			.then(function(rows) {
				return rows.reduce(function(schemaMap, schema) {
					schemaMap[schema.name] = schema.version;
					return schemaMap;
				}, {});
			});
	}

	_initVersions() {
		return this.knex.schema.createTableIfNotExists('schema_versions', this._createSchemaVersionTable);
	}
}

module.exports = FlemDB;
