'use strict';
const Async = require('async');
const FluxCore = require('./fluxCore');
const Server = require('./Server');
const FlemDb = require('./db');
const plugins = require('./plugins');
const RootActions = require('./RootActions');

const RinCore = require('./RinCore');

class Flemeth extends RinCore{
	constructor(options) {
		const flemDb = new FlemDb(options.db);
		const fluxCore = new FluxCore({
			logger: options.logger,
			db: flemDb
		}, options.logger);

		super({
			flux: fluxCore,
			db: flemDb,
			server: new Server(Object.assign({
				logger: options.logger,
				container: fluxCore,
				db: flemDb
			}, options.server)),
			logger: options.logger
		});
	}

	init(next) {
		Async.series([
			this.server.init.bind(this.server),	// Init server, just register some internal plugins onto it
			this.registerPlugin.bind(this),		// Plugins first, they register flux stores and db tables
			this.db.init.bind(this.db),			// Init the DB, run the migrations loop
			this.flux.init.bind(this.flux),		// Init the fluxcore, this puts state
			this.loadPersistance.bind(this)		// Collect and load persisting data into stores
		], next);
	}

	start(next) {
		this.logger.info('Flemeth daemon starting');

		Async.series([
			this.server.start.bind(this.server),
			super.start.bind(this)
		], next);
	}

	stop(next) {
		this.logger.info('Flemeth daemon stoping.');

		Async.series([
			this.server.stop.bind(this.server),
			super.stop.bind(this)
		], next);
	}

	registerPlugin(next) {
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
		this.flux.push(RootActions.loadFromDB, [[{
			modelName: 'Settings',
			key: 'settings'
		}, {
			modelName: 'Zones',
			key: 'zones'
		}, {
			modelName: 'Schedules',
			key: 'schedules'
		}]], next);
	}
}

module.exports = Flemeth;
