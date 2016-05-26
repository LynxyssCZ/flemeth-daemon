'use strict';
const Async = require('async');
const FluxCore = require('./FluxCore');
const FlemDb = require('./FlemDb');
const Server = require('./Server');
const RinCore = require('./RinCore');

const plugins = require('./plugins');
const RootActions = require('./RootActions');

class Flemeth extends RinCore{
	constructor(options) {
		super({
			logger: options.logger
		});

		this.options = options;
		this.persistance_info = [];
		this.addMethod('core.addPersistance', this.addPersistance.bind(this));
	}

	init(next) {
		Async.series([
			this.registerInternals.bind(this),	// Register internals
			this.registerPlugins.bind(this)		// Plugins first, they register flux stores and db tables
		], next);
	}

	start(next) {
		this.logger.info('Flemeth daemon starting');
		this.logger.debug({
			registeredPlugins: Object.keys(this.pluginInstances),
			coreExtensions: this.extensionsLog
		}, 'Extension data');

		Async.series([
			this.process.bind(this, 'core.startInternals', null), // Start internals first (this is nearly an ugly hack, but oh well...)
			// Can be alternativelly solved by registering a hook for lifecycle.start after registering all internals to load persistence there
			this.loadPersistance.bind(this),	// Collect and load persisting data into stores
			super.start.bind(this)
		], next);
	}

	stop(next) {
		this.logger.info('Flemeth daemon stoping.');

		return super.stop(next);
	}

	addPersistance(modelName, storeKey, isModel) {
		this.persistance_info.push({
			modelName: modelName,
			key: storeKey,
			isModel: isModel
		});
	}

	registerInternals(next) {
		super.register([{
			name: 'FluxCore',
			class: FluxCore
		}, {
			name: 'HapiServer',
			class: Server,
			options: this.options.server
		}, {
			name: 'FlemDB',
			class: FlemDb,
			options: this.options.db
		}], next);
	}

	registerPlugins(next) {
		super.register([{
			name: 'FlemethApi',
			class: plugins.FlemethApi,
			options: {
				apiPrefix: '/api'
			}
		}, {
			name: 'ApiDocs',
			class: plugins.ApiDocs,
			options: {
				apiTags: plugins.FlemethApi.attributes.swaggerSpecs.tags,
				apiPrefix: '/api',
				apiVersion: plugins.FlemethApi.attributes.version
			}
		}, {
			name: 'Thermostat',
			class: plugins.Thermostat,
			options: {

			}
		}], next);
	}

	loadPersistance(next) {
		if (this.persistance_info.length) {
			this.methods.flux.push(RootActions.loadFromDB, [this.persistance_info], next);
		}
		else {
			next();
		}
	}
}

module.exports = Flemeth;
