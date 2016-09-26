var assign = require('object-assign');
var sensors = require('./sensors');

var SensorsManager = function(options) {
	this.logger = options.logger.child({component: 'SensorsManager'});
	this.container = options.container;

	this.sensors = {};

	if (options.sensors) {
		options.sensors.forEach(function(spec) {
			this.addSensor(spec.name, spec.type, spec.options);
		}, this);
	}
}; SensorsManager.prototype.constructor = SensorsManager;
module.exports = SensorsManager;


SensorsManager.prototype.start = function(next) {
	this.logger.info('Starting sensors manager');

	for (var sensorName in this.sensors) {
		if (this.sensors.hasOwnProperty(sensorName)) {
			this.logger.info('Starting sensor ', sensorName);
			this.sensors[sensorName].start();
		}
	}

	next();
};

SensorsManager.prototype.stop = function(next) {
	this.logger.info('Stoping sensors manager');

	for (var sensorName in this.sensors) {
		if (this.sensors.hasOwnProperty(sensorName)) {
			this.logger.info('Stoping sensor ', sensorName);
			this.sensors[sensorName].stop();
		}
	}

	next();
};

SensorsManager.prototype.addSensor = function(name, type, options) {
	var SensorClass = sensors[type];
	var self = this;

	if (!SensorClass) {
		this.logger.error('Unknown reader type ', type);
		return;
	}
	this.logger.info('Adding sensor', name, type);

	var sensor = new SensorClass(assign({
		name: name,
		logger: this.logger,
		dispatchCallback: function(reader, frame) {
			self.container.push(self.container.actions.Sensors.readFrame, [frame]);
		}
	}, options));

	this.sensors[name] = sensor;
};

SensorsManager.prototype.removeSensor = function(name) {
	if (!this.sensors.hasOwnProperty(name)) {
		return false;
	}

	this.logger.info('Removing sensor', name);
	var sensor = sensors[name];
	sensor.stop();
	delete sensors[name];
};