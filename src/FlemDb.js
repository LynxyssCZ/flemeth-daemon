'use strict';
const Knex = require('knex');
const Bookshelf = require('bookshelf');

class FlemDB {
	constructor(knexConfig) {
		this.knex = new Knex(knexConfig);
		this.bookshelf = Bookshelf(this.knex);
		this.bookshelf.plugin(['virtuals', 'registry', 'visibility', 'bookshelf-camelcase']);
		this.models = {};
	}

	init(next) {
		return this._upgradeAllSchemas()
			.then(function() {
				next(null);
			}).catch(next);
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
