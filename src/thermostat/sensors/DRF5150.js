'use strict';
var bunyan = require('bunyan');
var Bluebird = require('bluebird');
var serialport = Bluebird.promisifyAll(require('serialport'));
var SerialPort = serialport.SerialPort;
var Gpio = Bluebird.promisifyAll(require('onoff')).Gpio;


var DRF5150Sensor = function (options) {
	this.options = options;
	this.log = options.logger ? options.logger.child({component: 'DRF5150Sensor'}) : bunyan.createLogger({name: 'DRF5150Sensor'});

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
		enable: 'number',
		group: 'number'
	}
};

DRF5150Sensor.prototype = Object.create({
	constructor: DRF5150Sensor,
	start: function() {
		this.enable = new Gpio(this.options.enable, 'out');

		this.enable.writeAsync(true)
			.bind(this).then(function() {
				return this.serialPort.openAsync();
			})
			.catch(function(err) {
				this.log.err({error: err}, 'Error while starting sensor');
			});
	},
	stop: function() {
		this.log.debug('Stoping sensor');
	},
	dispatchFrame: function(frame) {
		this.options.dispatchCallback(this.options.name, frame);
	},
	onDataRead: function(data) {
		var frame = {
			groupId: data.readUInt8(0),
			sensorId: data.readUInt8(1),
			value: data.readUInt16LE(2)
		};

		this.log.debug(frame);
	}
});

module.exports = DRF5150Sensor;
