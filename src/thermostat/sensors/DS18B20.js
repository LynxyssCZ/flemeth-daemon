'use strict';
var bunyan = require('bunyan');
var sensor = require('ds18x20');


var DS18B20Sensor = function (options) {
	this.options = options;
	this.log = options.logger ? options.logger.child({component: 'DS18B20Sensor'}) : bunyan.createLogger({name: 'DS18B20Sensor'});

	this.parseTempObj = this.parseTempObj.bind(this);
	this.onDriversLoad = this.onDriversLoad.bind(this);
}; DS18B20Sensor.prototype.constructor = DS18B20Sensor;
module.exports = DS18B20Sensor;

DS18B20Sensor.properties = {
	prefix: 'ds18x20',
	type: 'temp',
	options: {
		interval: 'number'
	}
};

DS18B20Sensor.prototype.start = function() {
	sensor.isDriverLoaded(this.onDriversLoad);
};

DS18B20Sensor.prototype.stop = function() {
	this.log.debug('Stoping sensor');
	clearInterval(this.intervalId);
	delete this.intervalId;
};

DS18B20Sensor.prototype.dispatchFrame = function(frame) {
	this.options.dispatchCallback(this.options.name, frame);
};

DS18B20Sensor.prototype.onDriversLoad = function(err, isLoaded) {
	var self = this;
	if (!err && isLoaded) {
		this.log.debug('Starting sensor');

		this.intervalId = setInterval(function() {
			sensor.getAll(self.parseTempObj);
		}, this.options.interval);
	}
	else {
		this.log.error('Modules not loaded');
	}
};

DS18B20Sensor.prototype.parseTempObj = function(err, tempObj) {
	if (err) {
		this.log.debug('No values');
		return;
	}

	var samples = this.createSamples(tempObj);

	this.dispatchFrame({
		reader: DS18B20Sensor.properties.prefix,
		samples: samples
	});
};

DS18B20Sensor.prototype.createSamples = function(tempObj) {
	return Object.keys(tempObj).map(function(id) {
		return {
			sensorId: DS18B20Sensor.properties.prefix + '-' + id,
			type: DS18B20Sensor.properties.type,
			value: tempObj[id],
			time: Date.now()
		};
	}, this);
};
