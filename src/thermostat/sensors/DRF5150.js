'use strict';
var bunyan = require('bunyan');
var Bluebird = require('bluebird');
var serialport = Bluebird.promisifyAll(require('serialport'));
var SerialPort = serialport.SerialPort;


var DRF5150Sensor = function (options) {
	this.options = options;
	this.log = options.logger ? options.logger.child({component: 'DRF5150Sensor'}) : bunyan.createLogger({name: 'DRF5150Sensor'});
	this.enable = this.options.enable;

	this.serialPort = new SerialPort(options.tty, {
		baudrate: 9600,
		parser: serialport.parsers.raw
	}, false);

	this.onDataRead = this.onDataRead.bind(this);
	this.serialPort.on('data', this.onDataRead);
};

DRF5150Sensor.properties = {
	prefix: 'DRF5150',
	type: 'temp',
	options: {
		tty: 'string',
		enable: 'number'
	}
};

DRF5150Sensor.prototype.constructor = DRF5150Sensor;

DRF5150Sensor.prototype.start = function() {
	this.enable.writeAsync(true)
		.bind(this).then(function() {
			return this.serialPort.openAsync();
		})
		.catch(function(err) {
			this.log.err({error: err}, 'Error while starting sensor');
		});
};

DRF5150Sensor.prototype.stop = function() {
	this.log.debug('Stoping sensor');
	this.enable.writeSync(false);
	this.serialPort.close();
};

DRF5150Sensor.prototype.dispatchFrame = function(frame) {
	this.options.dispatchCallback(this.options.name, frame);
};

DRF5150Sensor.prototype.onDataRead = function(data) {
	// TODO: Need to fix wrong buffering and nonexistent validation
	var sensorId = DRF5150Sensor.properties.prefix + '-' + data.readUInt8(0) + '-' + data.readUInt8(1);

	if(data.length !== 6) {
		this.log.warn(data, 'Buffer is not the expected length');
		return;
	}

	this.dispatchFrame({
		reader: DRF5150Sensor.properties.prefix,
		samples: [
			{
				sensorId: sensorId,
				type: DRF5150Sensor.properties.type,
				value: (data.readUInt16LE(2) / 16),
				meta: {
					vbat: (data.readUInt8(4) / 100) + 2,
					rssi: data.readUInt8(5)
				},
				time: Date.now()
			}
		]
	});
};


module.exports = DRF5150Sensor;
