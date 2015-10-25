require('dotenv').load();
var bunyan = require('bunyan');
var Flemeth = require('./src');

var log = bunyan.createLogger({name: 'Flemeth', level: process.env.LOG_LEVEL});
var flemeth = new Flemeth({
	logger: log,
	// other config
	thermostat: {
		sensors: [
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
					enable: 17
				}
			}
		]
	}
});

flemeth.container.subscribe(['Sensors'], function() {
	log.info(flemeth.container.getState(['Sensors']), 'Update of sensors');
});

var clear = function() {
	flemeth.stop();
	process.exit();
};

var start = function() {
	flemeth.start();
};
process.on('SIGINT', clear);

start();
