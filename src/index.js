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
		const flemDb = new FlemDb(options.db, options.logger);
		const fluxCore = new FluxCore({
			logger: options.logger,
			db: flemDb
		}, options.logger);

		super({
			flux: fluxCore,
			db: flemDb,
			server: new Server(Object.assign({
				logger: options.logger
			}, options.server)),
			logger: options.logger
		});

		this.persistance_info = [];
		this.addMethod('core.addPersistance', this.addPersistance.bind(this));
	}

	init(next) {
		Async.series([
			this.server.init.bind(this.server),	// Init server, just register some internal plugins onto it
			this.registerPlugins.bind(this),	// Plugins first, they register flux stores and db tables
			this.db.init.bind(this.db),			// Init the DB, run the migrations loop
			this.flux.init.bind(this.flux),		// Init the fluxcore, this flushes stores with init action
			this.loadPersistance.bind(this)		// Collect and load persisting data into stores
		], next);
	}

	start(next) {
		this.logger.info('Flemeth daemon starting');
		this.logger.debug({
			registeredPlugins: Object.keys(this.pluginInstances),
			coreExtensions: this.extensionsLog
		}, 'Extension data');

		Async.series([
			this.server.start.bind(this.server),
			super.start.bind(this)
		], next);
	}

	stop(next) {
		this.logger.info('Flemeth daemon stoping.');

		Async.series([
			this.db.stop.bind(this.db),
			this.server.stop.bind(this.server),
			super.stop.bind(this)
		], next);
	}

	addPersistance(modelName, storeKey) {
		this.persistance_info.push({
			modelName: modelName,
			key: storeKey
		});
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
			this.flux.push(RootActions.loadFromDB, [this.persistance_info], next);
		}
		else {
			next();
		}
	}
}

module.exports = Flemeth;
