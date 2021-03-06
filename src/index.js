'use strict';
const Async = require('async');
const RinCore = require('./RinCore');


class Flemeth extends RinCore{
	constructor(options) {
		super({
			logger: options.logger
		});

		this.options = options;
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
			pluginTree: this.getPluginTree()
		}, 'Extension data');

		return super.start(next);
	}

	stop(next) {
		this.logger.info('Flemeth daemon stoping.');

		return super.stop(next);
	}

	registerInternals(next) {
		super.register([{
			name: 'FluxCore',
			class: require('./FluxCore')
		}, {
			name: 'HapiServer',
			class: require('./Server'),
			options: this.options.server
		}, {
			name: 'FlemethApi',
			class: require('./FlemethApi'),
			options: {
				apiPrefix: '/api'
			}
		}, {
			name: 'FlemDB',
			class: require('./FlemDb'),
			options: this.options.db
		}, {
			name: 'Persistence',
			class: require('./Persistence')
		}], next);
	}

	registerPlugins(next) {
		super.register([{
			name: 'Settings',
			class: require('./settings')
		}, {
			name: 'Snapshots',
			class: require('./snapshots'),
			options: this.options.snapshots
		}, {
			name: 'ApiDocs',
			class: require('./ApiDocs'),
			options: {
				apiTags: require('./FlemethApi').attributes.swaggerSpecs.tags,
				apiPrefix: '/api',
				apiVersion: require('./FlemethApi').attributes.version
			}
		}, {
			name: 'Thermostat',
			class: require('./thermostat'),
			options: this.options.thermostat
		}], next);
	}
}

module.exports = Flemeth;
