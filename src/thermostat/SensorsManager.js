var assign = require('object-assign');
var sensors = require('./sensors');

var SensorsManager = function(options) {
	this.options = options;
	this.logger = options.logger.child({component: 'SensorsManager'});
	this.sensors = {};

	if (options.sensors) {
		options.sensors.forEach(function(spec) {
			this.addSensor(spec.name, spec.type, spec.options);
		}, this);
	}

	this.dispatchFrame = this.dispatchFrame.bind(this);
}; SensorsManager.prototype.constructor = SensorsManager;
module.exports = SensorsManager;


SensorsManager.prototype.start = function() {
	this.logger.info('Starting sensors manager');

	for (var sensorName in this.sensors) {
		if (this.sensors.hasOwnProperty(sensorName)) {
			this.logger.debug('Starting sensor ' + sensorName);
			this.sensors[sensorName].start();
		}
	}
};

SensorsManager.prototype.stop = function() {
	this.logger.info('Stoping sensors manager');

	for (var sensorName in this.sensors) {
		if (this.sensors.hasOwnProperty(sensorName)) {
			this.logger.debug('Stoping sensor ' + sensorName);
			this.sensors[sensorName].stop();
		}
	}
};

SensorsManager.prototype.addSensor = function(name, type, options) {
	var SensorClass = sensors[type];

	if (!SensorClass) {
		this.logger.warn('Unknown reader type ' + type);
		return;
	}

	var sensor = new SensorClass(assign({
		name: name,
		logger: this.logger,
		dispatchCallback: this.dispatchFrame
	}, options));

	this.sensors[name] = sensor;
};

SensorsManager.prototype.removeSensor = function(name) {
	if (!this.sensors.hasOwnProperty(name)) {
		return false;
	}

	var sensor = sensors[name];
	sensor.stop();
	delete sensors[name];
};

SensorsManager.prototype.dispatchFrame = function(reader, frame) {
	this.logger.info({
		reader: reader,
		frame: frame
	}, 'Read values');
};
