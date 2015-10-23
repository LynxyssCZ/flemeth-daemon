var bunyan = require('bunyan');
var sensors = require('./sensors');


var log = bunyan.createLogger({name: 'SensorsManager', level: process.env.LOG_LEVEL});


var SensorsManager = function(options) {
	this.options = options;
	this.sensors = {};
};

SensorsManager.prototype = Object.create({
	constructor: SensorsManager,
	addSensor: function(name, type, options) {
		var SensorClass = sensors[type];

		if (!SensorClass) {
			log.warn('Unknown reader type ' + type);
		}

		options = Object.create(options);
		options.name = name;
		options.dispatchCallback = this.options.callback;

		var sensor = new SensorClass(options);

		this.sensors[name] = sensor;
	},
	removeSensor: function(name) {
		if (!this.sensors.hasOwnProperty(name)) {
			return false;
		}

		var sensor = sensors[name];
		sensor.stop();
		delete sensors[name];
	},
	start: function() {
		log.debug('Starting sensors manager');

		for (var sensorName in this.sensors) {
			if (this.sensors.hasOwnProperty(sensorName)) {
				log.debug('Starting sensor ' + sensorName);
				this.sensors[sensorName].start();
			}
		}
	},
	stop: function() {
		log.debug('Stoping sensors manager');

		for (var sensorName in this.sensors) {
			if (this.sensors.hasOwnProperty(sensorName)) {
				log.debug('Stoping sensor ' + sensorName);
				this.sensors[sensorName].stop();
			}
		}
	}
});

module.exports = SensorsManager;
