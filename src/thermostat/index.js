var SensorsManager = require('./SensorsManager');
var ZonesManager = require('./ZonesManager');
var SwitcherManager = require('./SwitcherManager');


var Thermostat = function(options) {
	this.logger = options.logger.child({component: 'Thermostat'});

	this.actions = options.actions;
	this.container = options.container;

	this.createZonesManager(options);
	this.createSensorsManager(options);
	this.createSwitcherManager(options);
};
module.exports = Thermostat;

Thermostat.prototype.start = function(next) {
	this.logger.info('Thermostat starting');
	this.zonesManager.start();
	this.sensorsManager.start();
	next();
};

Thermostat.prototype.stop = function(next) {
	this.logger.info('Thermostat stoping');
	this.zonesManager.stop();
	this.sensorsManager.stop();
	next();
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
