'use strict';
var assign = require('object-assign');
var Async = require('async');
var Core = require('./fluxCore');
var Server = require('./server');
var Thermostat = require('./thermostat');
var FlemDb = require('./db');

class Flemeth {
	constructor(options) {
		this.logger = options.logger;
		this.createContainer();
		this.dbOptions = options.db;

		this.thermostat = new Thermostat(assign({
			logger: this.logger,
			container: this.container,
			db: FlemDb
		}, options.thermostat));

		this.server = new Server(assign({
			logger: this.logger,
			container: this.container,
			db: FlemDb
		}, options.server));
	}

	init(next) {
		Async.series([
			this.initDB.bind(this),
			this.container.init.bind(this.container),
			this.server.init.bind(this.server),
			this.loadPersistance.bind(this)
		], next);
	}

	start(next) {
		this.logger.info('Flemeth daemon starting');

		Async.series([
			this.thermostat.start.bind(this.thermostat),
			this.server.start.bind(this.server)
		], next);
	}

	stop(next) {
		this.logger.info('Flemeth daemon stoping.');

		Async.series([
			this.thermostat.stop.bind(this.thermostat),
			this.server.stop.bind(this.server)
		], next);
	}

	initDB(next) {
		return FlemDb.config(this.dbOptions, next);
	}

	createContainer() {
		this.container = new Core({
			logger: this.logger,
			db: FlemDb
		}, this.logger);
	}

	loadPersistance(next) {
		this.container.push(this.container.actions.Root.loadFromDB, [], next);
	}
}

module.exports = Flemeth;
