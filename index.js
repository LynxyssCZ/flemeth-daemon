require('dotenv').load();
var bunyan = require('bunyan');


var SensorsManager = require('./src/thermostat/SensorsManager');


var log = bunyan.createLogger({name: 'Flemeth', level: process.env.LOG_LEVEL});


var manager;

var clear = function() {
	manager.stop();
	process.exit();
};

var start = function() {
	manager = new SensorsManager({
		logger: log,
		callback: function (name, value) {
			log.info(value, 'Sensor values');
		}
	});

	manager.addSensor('DS18B20', 'DS18B20', {
		interval: 5000
	});

	manager.addSensor('DRF', 'DRF5150', {
		tty: '/dev/ttyAMA0',
		enable: 17
	});

	manager.start();
};
process.on('SIGINT', clear);

start();
