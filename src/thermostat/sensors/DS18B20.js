'use strict';
var bunyan = require('bunyan');
var sensor = require('ds18x20');


var log = bunyan.createLogger({name: 'DS18B20Sensor', level: process.env.LOG_LEVEL});


var DS18B20Sensor = function (options) {
	this.options = options;
};

DS18B20Sensor.properties = {
	prefix: 'ds18x20',
	type: 'temp',
	options: {
		interval: 'number'
	}
};

DS18B20Sensor.prototype = Object.create({
	constructor: DS18B20Sensor,
	start: function() {
		this._startReading();
	},
	stop: function() {
		clearInterval(this.intervalId);
		delete this.intervalId;
	},
	dispatchFrame: function(frame) {
		this.options.dispatchCallback(this.options.name, frame);
	},
	_startReading: function() {
		var self = this;

		sensor.isDriverLoaded(function(err, isLoaded) {
			if (!err && isLoaded) {
				log.debug('Starting reader');

				self.intervalId = setInterval(function() {
					self._readValues();
				}, self.options.interval);
			}
			else {
				log.error('Modules not loaded');
			}
		});
	},
	_readValues: function() {
		var self = this;

		sensor.getAll(function(err, tempObj) {
			if (err) {
				log.debug('No values');
				return;
			}

			var samples = self._createSamples(tempObj);

			self.dispatchFrame({
				reader: DS18B20Sensor.properties.prefix,
				samples: samples
			});
		});
	},
	_createSamples: function(tempObj) {
		return Object.keys(tempObj).map(function(id) {
			return this._createSample(id, tempObj[id]);
		}, this);
	},
	_createSample: function(id, value) {
		return {
			id: DS18B20Sensor.properties.prefix + '-' + id,
			type: DS18B20Sensor.properties.type,
			value: value,
			time: Date.now()
		};
	}
});

module.exports = DS18B20Sensor;
