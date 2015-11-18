require('dotenv').load();
var bunyan = require('bunyan');
var Async = require('async');
var path = require('path');

var Flemeth = require('./src');


var log = bunyan.createLogger({name: 'Flemeth', level: process.env.LOG_LEVEL});

// TODO: Load settings from file or so
var flemeth = new Flemeth({
	logger: log,
	// other config
	server: {
		connection: {
			port: 8098,
			host: '0.0.0.0'
		}
	},
	db: {
		nedbPath: path.join(__dirname, 'databases'),
		sqliteFile: path.join(__dirname, 'databases/flemeth.sqlite'),
		knexFile: require('./knexfile')
	},
	thermostat: {
		updatePeriod: 5 * 1000,
		pin: 15,
		lockTime:  5 * 60 * 1000,
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

var clear = function() {
	flemeth.stop(function() {
		log.info('Stopped');
		process.exit();
	});
};

var start = function() {
	Async.series([
		flemeth.init.bind(flemeth),
		flemeth.start.bind(flemeth)
	], function(error) {
		if (error) {
			log.error(error);
			clear();
		}
		else {
			log.info('Started');
		}
	});
};
process.on('SIGINT', clear);

start();
