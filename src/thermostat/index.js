var SensorsManager = require('./SensorsManager');
var ZonesManager = require('./ZonesManager');
var SwitcherManager = require('./SwitcherManager');
var SchedulesManager = require('./SchedulesManager');
var TemperatureChecker = require('./TemperatureChecker');


var Thermostat = function(options) {
	this.logger = options.logger.child({component: 'Thermostat'});

	this.actions = options.actions;
	this.container = options.container;

	this.createZonesManager(options);
	this.createSensorsManager(options);
	this.createSwitcherManager(options);
	this.createSchedulesManager(options);
	this.createTempCheckerManager(options);
};
module.exports = Thermostat;

Thermostat.prototype.start = function(next) {
	this.logger.info('Thermostat starting');
	this.switcherManager.start();
	this.tempChecker.start();
	this.schedulesManager.start();
	this.zonesManager.start();
	this.sensorsManager.start();
	next();
};

Thermostat.prototype.stop = function(next) {
	this.logger.info('Thermostat stoping');
	this.zonesManager.stop();
	this.sensorsManager.stop();
	this.schedulesManager.stop();
	this.tempChecker.stop();
	this.switcherManager.stop(function() {
		next();
	});
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
