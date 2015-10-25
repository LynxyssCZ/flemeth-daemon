var SensorsManager = require('./SensorsManager');


var Thermostat = function(options) {
	this.logger = options.logger.child({component: 'Thermostat'});

	this.actions = options.actions;
	this.container = options.container;
	this.createSensorsManager(options);
};
module.exports = Thermostat;

Thermostat.prototype.start = function(next) {
	this.logger.info('Thermostat starting');
	this.manager.start();
	next();
};

Thermostat.prototype.stop = function(next) {
	this.logger.info('Thermostat stoping');
	this.manager.stop();
	next();
};

Thermostat.prototype.createSensorsManager = function(options) {
	this.manager = new SensorsManager({
		logger: options.logger,
		sensors: options.sensors,
		actions: options.actions,
		container: options.container
	});
};
