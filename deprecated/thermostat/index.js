'use strict';
var Async = require('async');

var ZonesManager = require('./ZonesManager');
var SchedulesManager = require('./SchedulesManager');
var TemperatureChecker = require('./TemperatureChecker');
var SnapshotsManager = require('./SnapshotsManager');
var OverridesManager = require('./OverridesManager');

class Thermostat {
	constructor(options) {
		this.logger = options.logger.child({component: 'Thermostat'});

		this.actions = options.actions;
		this.container = options.container;

		this.createZonesManager(options);
		this.createSchedulesManager(options);
		this.createTempCheckerManager(options);
		this.createSnapshotsManager(options);
		this.createOverridesManager(options);
	}

	start(next) {
		this.logger.info('Thermostat starting');
		Async.series([
			this.tempChecker.start.bind(this.tempChecker),
			this.schedulesManager.start.bind(this.schedulesManager),
			this.zonesManager.start.bind(this.zonesManager),
			this.overridesManager.start.bind(this.overridesManager),
			this.snapshotsManager.start.bind(this.snapshotsManager)
		], next);
	}

	stop(next) {
		this.logger.info('Thermostat stoping');
		Async.series([
			this.snapshotsManager.stop.bind(this.snapshotsManager),
			this.zonesManager.stop.bind(this.zonesManager),
			this.schedulesManager.stop.bind(this.schedulesManager),
			this.tempChecker.stop.bind(this.tempChecker),
			this.overridesManager.stop.bind(this.overridesManager)
		], next);
	}

	createZonesManager(options) {
		this.zonesManager = new ZonesManager({
			logger: options.logger,
			container: options.container
		});
	}

	createSchedulesManager (options) {
		this.schedulesManager = new SchedulesManager({
			logger: options.logger,
			container: options.container,
			updatePeriod: options.updatePeriod
		});
	}

	createTempCheckerManager (options) {
		this.tempChecker = new TemperatureChecker({
			logger: options.logger,
			container: options.container
		});
	}

	createSnapshotsManager(options) {
		this.snapshotsManager = new SnapshotsManager({
			logger: options.logger,
			container: options.container,
			updatePeriod: options.snapshotPeriod
		});
	}

	createOverridesManager(options) {
		this.overridesManager = new OverridesManager({
			logger: options.logger,
			container: options.container
		});
	}
}

module.exports = Thermostat;
