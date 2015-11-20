var Async = require('async');

var SensorsManager = require('./SensorsManager');
var ZonesManager = require('./ZonesManager');
var SwitcherManager = require('./SwitcherManager');
var SchedulesManager = require('./SchedulesManager');
var TemperatureChecker = require('./TemperatureChecker');
var SnapshotsManager = require('./SnapshotsManager');


var Thermostat = function(options) {
	this.logger = options.logger.child({component: 'Thermostat'});

	this.actions = options.actions;
	this.container = options.container;

	this.createZonesManager(options);
	this.createSensorsManager(options);
	this.createSwitcherManager(options);
	this.createSchedulesManager(options);
	this.createTempCheckerManager(options);
	this.createSnapshotsManager(options);
};
module.exports = Thermostat;

Thermostat.prototype.start = function(next) {
	this.logger.info('Thermostat starting');
	Async.series([
		this.switcherManager.start.bind(this.switcherManager),
		this.tempChecker.start.bind(this.tempChecker),
		this.schedulesManager.start.bind(this.schedulesManager),
		this.zonesManager.start.bind(this.zonesManager),
		this.sensorsManager.start.bind(this.sensorsManager),
		this.snapshotsManager.start.bind(this.snapshotsManager)
	], next);
};

Thermostat.prototype.stop = function(next) {
	this.logger.info('Thermostat stoping');
	Async.series([
		this.snapshotsManager.stop.bind(this.snapshotsManager),
		this.sensorsManager.stop.bind(this.sensorsManager),
		this.zonesManager.stop.bind(this.zonesManager),
		this.schedulesManager.stop.bind(this.schedulesManager),
		this.tempChecker.stop.bind(this.tempChecker),
		this.switcherManager.stop.bind(this.switcherManager)
	], next);
};

Thermostat.prototype.createSensorsManager = function(options) {
	this.sensorsManager = new SensorsManager({
		logger: options.logger,
		sensors: options.sensors,
		container: options.container
	});
};

Thermostat.prototype.createZonesManager = function (options) {
	this.zonesManager = new ZonesManager({
		logger: options.logger,
		container: options.container
	});
};

Thermostat.prototype.createSwitcherManager = function (options) {
	this.switcherManager = new SwitcherManager({
		logger: options.logger,
		container: options.container,
		lockTime: options.lockTime,
		pin: options.switcherPin
	});
};

Thermostat.prototype.createSchedulesManager = function (options) {
	this.schedulesManager = new SchedulesManager({
		logger: options.logger,
		container: options.container,
		updatePeriod: options.updatePeriod
	});
};

Thermostat.prototype.createTempCheckerManager = function (options) {
	this.tempChecker = new TemperatureChecker({
		logger: options.logger,
		container: options.container
	});
};

Thermostat.prototype.createSnapshotsManager = function(options) {
	this.snapshotsManager = new SnapshotsManager({
		logger: options.logger,
		container: options.container,
		updatePeriod: 5 * 60 * 1000
	});
};
