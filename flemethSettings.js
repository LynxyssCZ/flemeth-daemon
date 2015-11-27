var Knex = require('knex');
var Bluebird = require('bluebird');
var MockGpio = require('./GpioMock');
Bluebird.promisifyAll(MockGpio.prototype);


var FlemethSettings = function(options) {
	this.logger = options.logger;
	this.knex = new Knex(require('./knexfile'));

	if (options.mockGpio) {
		this.enablePin = new MockGpio(process.env.ENABLE_PIN, 'out', options.logger);
		this.switcherPin = new MockGpio(process.env.SWITCHER_PIN, 'out', options.logger);
	}
	else {
		var Gpio = Bluebird.promisifyAll(require('onoff')).Gpio;
		this.enablePin = new Gpio(process.env.ENABLE_PIN, 'out');
		this.switcherPin = new Gpio(process.env.SWITCHER_PIN, 'out');
	}
}; FlemethSettings.prototype.constructor = FlemethSettings;

module.exports = FlemethSettings;

FlemethSettings.prototype.get = function () {
	return {
		logger: this.logger,
		server: {
			connection: {
				port: 8098,
				host: '0.0.0.0',
				routes: {
					cors: true
				}
			}
		},
		db: this.knex,
		thermostat: {
			updatePeriod: 15 * 1000,
			snapshotPeriod: 5 * 60 * 1000,
			switcherPin: this.switcherPin,
			lockTime:  5 * 60 * 1000,
			sensors: this.getSensors()
		}
	};
};

FlemethSettings.prototype.getSensors = function () {
	return [
		{
			name: 'Local DS',
			type: 'DS18B20',
			options: { interval: 60000 }
		},
		{
			name: 'DRF',
			type: 'DRF5150',
			options: {
				tty: '/dev/ttyAMA0',
				enable: this.enablePin
			}
		}
	];
};

FlemethSettings.prototype.destroy = function () {
	this.knex.destroy();
	this.enablePin.unexport();
	this.switcherPin.unexport();
};
